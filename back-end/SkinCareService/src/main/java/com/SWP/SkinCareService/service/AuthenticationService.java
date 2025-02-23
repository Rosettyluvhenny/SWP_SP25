package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Identity.AuthenticationRequest;
import com.SWP.SkinCareService.dto.request.Identity.IntrospectRequest;
import com.SWP.SkinCareService.dto.request.Identity.LogoutRequest;
import com.SWP.SkinCareService.dto.request.Identity.RefreshRequest;
import com.SWP.SkinCareService.dto.response.AuthenticationResponse;
import com.SWP.SkinCareService.dto.response.IntrospectResponse;
import com.SWP.SkinCareService.entity.InvalidatedToken;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.InvalidatedTokenRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepo;
    InvalidatedTokenRepository invalidatedTokenRepository;
    @Value("${jwt.signerKey}")
    @NonFinal
    String SIGNER_KEY;

    @Value("${jwt.valid-duration}")
    @NonFinal
    long VALID_DURATION;

    @Value("${jwt.refreshable-duration}")
    @NonFinal
    long REFRESHABLE_DURATION;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        try {
            verifyToken(token, false);
        } catch (Exception e) {
            // Handle exception (token is invalid or malformed)
            return IntrospectResponse.builder()
                    .valid(false)
                    .build();
        }
        return IntrospectResponse.builder()
                .valid(true)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var user = userRepo.findByUsername(request.getUsername())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(),user.getPassword());

        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token = generateToken(user);
    return AuthenticationResponse.builder()
            .token(token)
            .build();
    }

    private String generateToken(User user) {
        try {
            // Create JWS Header
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

            // Create JWT Claims
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .issuer("swpsp25.com")
                    .issueTime(Date.from(Instant.now()))
                    .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", buildScope(user))
                    .build();

            // Create Payload
            Payload payload = new Payload(jwtClaimsSet.toJSONObject());

            // Create JWS Object
            JWSObject jwsObject = new JWSObject(header, payload);

            // Sign the JWS object using HMAC-SHA512
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));

            // Serialize to compact form
            return jwsObject.serialize();
        } catch (JOSEException ex) {
            throw new RuntimeException(ex);
        }
    }
    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        user.getRoles().forEach((s)-> log.info(s.getName()));
        if(!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role ->{
                stringJoiner.add("ROLE_"+role.getName());
            });

        return stringJoiner.toString();
    }
    @Transactional
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), false);
            String jit = signToken.getJWTClaimsSet().getJWTID();

            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch(AppException e){
            log.info("Token is already expired");
        }

    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
         JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

         SignedJWT signedJWT = SignedJWT.parse(token);

         Date expiryTime =(isRefresh)
                 ? new Date (signedJWT.getJWTClaimsSet().getIssueTime().
                 toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                 : signedJWT.getJWTClaimsSet().getExpirationTime();

         var verified =signedJWT.verify(verifier);

         if(!(verified && expiryTime.after(new Date())))
             throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
         return signedJWT;
    }

    @Transactional
    public AuthenticationResponse refreshToken(RefreshRequest request)
            throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken(), true);

        var jit = signJWT.getJWTClaimsSet().getJWTID();

        var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();

       InvalidatedToken invalidatedToken = InvalidatedToken.builder()
               .id(jit)
               .expiryTime(expiryTime)
               .build();
       invalidatedTokenRepository.save(invalidatedToken);

        var username = signJWT.getJWTClaimsSet().getSubject();

        var user = userRepo.findByUsername(username).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }


}
