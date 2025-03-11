package com.SWP.SkinCareService.controller;


import com.SWP.SkinCareService.dto.request.Identity.AuthenticationRequest;
import com.SWP.SkinCareService.dto.request.Identity.IntrospectRequest;
import com.SWP.SkinCareService.dto.request.Identity.LogoutRequest;
import com.SWP.SkinCareService.dto.request.Identity.RefreshRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.AuthenticationResponse;
import com.SWP.SkinCareService.dto.response.IntrospectResponse;
import com.SWP.SkinCareService.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(@RequestBody AuthenticationRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.authenticate(request);

        return ResponseEntity.ok(
                ApiResponse.<AuthenticationResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @PostMapping("/introspect")
    public ResponseEntity<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
            return ResponseEntity.ok().body(
                    ApiResponse.<IntrospectResponse>builder()
                            .result(result)
                            .build()
            );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest request)
            throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refresh(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ResponseEntity.ok(
                ApiResponse.<AuthenticationResponse>builder()
                        .result(result)
                        .build()
        );
    }



}
