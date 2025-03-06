package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Identity.UserRequest;
import com.SWP.SkinCareService.dto.request.Identity.UserUpdateRequest;
import com.SWP.SkinCareService.dto.response.UserResponse;
import com.SWP.SkinCareService.entity.Role;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.UserMapper;
import com.SWP.SkinCareService.repository.RoleRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if(userRepository.existsByPhone(request.getPhone()))
            throw new AppException(ErrorCode.PHONE_EXISTED);
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role roleUser = roleRepository.findById("USER").orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        Set<Role> roles = new HashSet<>();
        roles.add(roleUser);
        user.setRoles(roles);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    public Page<UserResponse> getAllActive(Pageable pageable) {

        return userRepository.findAllByIsActiveTrue(pageable)
                .map(userMapper::toResponse);
    }


    public Page<UserResponse> getAllUnactive(Pageable pageable) {

        return userRepository.findAllByIsActiveFalse(pageable)
                .map(userMapper::toResponse);
    }

    @PostAuthorize("returnObject.id == authentication.id")
    public UserResponse getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponse(user);
    }

    public User getById(String id) {
        return userRepository.findById(id).orElseThrow(()-> new RuntimeException("user can not be found"));
    }

    public User getUserByUsername(String userName){
        return userRepository.findByUsername(userName).orElseThrow(()-> new RuntimeException("user can not be found"));
    }

    @Transactional
    @PostAuthorize("returnObject.id == authentication.id")
    public UserResponse update(UserUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userMapper.update(request, user);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Transactional
    public void activate(String username) {
        User user = checkUser(username);
        if (user.isActive())
            throw new AppException(ErrorCode.ACTIVATED);
        user.setActive(true);
        userRepository.save(user);
    }

    @Transactional
    public void deactivate(String username) {
        User user = checkUser(username);
        if (!user.isActive())
            throw new AppException(ErrorCode.DEACTIVATED);
        user.setActive(false);
        userRepository.save(user);
    }

    private User checkUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void delete(String userId){
        var user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.getRoles().clear();
        userRepository.delete(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserResponse disable(String userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setActive(false);

        return userMapper.toResponse(userRepository.save(user));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserResponse createStaff(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            log.info(userRepository.existsByEmail(request.getEmail()) + " existed: "+ request.getEmail());
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if(userRepository.existsByPhone(request.getPhone()))
            throw new AppException(ErrorCode.PHONE_EXISTED);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role roleUser = roleRepository.findById("STAFF").orElseThrow(()-> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        Set<Role> roles = new HashSet<>();
        roles.add(roleUser);
        user.setRoles(roles);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}
