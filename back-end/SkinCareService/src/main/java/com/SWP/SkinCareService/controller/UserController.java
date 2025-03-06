package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Identity.UserRequest;
import com.SWP.SkinCareService.dto.request.Identity.UserUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.UserResponse;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.service.UserService;
import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;


@Slf4j
@RestController
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody @Valid UserRequest requestDto) {
        var user = userService.create(requestDto);
        return ResponseEntity.status(201).body(
                ApiResponse.<UserResponse>builder()
                        .result(user)
                        .build()
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsersActive(Pageable pageable) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(
                ApiResponse.<Page<UserResponse>>builder()
                        .result(userService.getAllActive(pageable))
                        .build()
        );
    }

    @GetMapping("/unactive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsersUnactive(Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.<Page<UserResponse>>builder()
                        .result(userService.getAllUnactive(pageable))
                        .build()
        );
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(
                ApiResponse.<User>builder()
                        .result(userService.getById(userId))
                        .build()
        );
    }

    @GetMapping("/getMyInfo")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo() {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .result(userService.getMyInfo())
                        .build()
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> update(
            @PathVariable String userId,
            @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .result(userService.update(request))
                        .build()
        );
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String userId) {
        userService.delete(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/disable")
    public ResponseEntity<Void> disable(@PathVariable String userId) {
        userService.disable(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(@RequestBody UserRequest request){
        var result = userService.createStaff(request);
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .result(result)
                        .build()
        );
    }
}
