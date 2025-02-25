package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Identity.UserRequest;
import com.SWP.SkinCareService.dto.request.Identity.UserUpdateRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
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
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
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
public class UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;


    public User createUser(UserRequest userRequest){

        if(userRepository.existsByUsername(userRequest.getUsername())||userRepository.existsByEmail(userRequest.getEmail())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(userRequest);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role roleUser = roleRepository.findById("USER").orElseThrow(()-> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        Set<Role> roles = new HashSet<>();
        roles.add(roleUser);
        user.setRoles(roles);
        user.setActive(true);
        return userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {

        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.id == authentication.id")
    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }
    public User getUser(String id) {
        return userRepository.findById(id).orElseThrow(()-> new RuntimeException("user can not be found"));
    }
//    @PostAuthorize("returnObject.id == authentication.id")
    public User getUserByUsername(String userName){
        return userRepository.findByUsername(userName).orElseThrow(()-> new RuntimeException("user can not be found"));
    }

    @PreAuthorize("returnObject.id == authentication.id")
    @Transactional
    public UserResponse updateUser(String userId, UserUpdateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(request,user);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void delete(String userId){
        userRepository.delete(userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserResponse disable(String userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setActive(false);

        return userMapper.toUserResponse(userRepository.save(user));
    }


}
