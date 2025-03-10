package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.request.Room.RoomUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.service.RoomService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {
    RoomService roomService;

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoomResponse> update(@PathVariable int id, @Valid @RequestBody RoomUpdateRequest request) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.update(id, request))
                .build();
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<RoomResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<RoomResponse>>builder()
                .result(roomService.getAll(pageable))
                .build();
    }

    @GetMapping("/service/{serviceId}")
    //@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<RoomResponse>> getAllByService(
            @PathVariable int serviceId,
            Pageable pageable) {
        return ApiResponse.<Page<RoomResponse>>builder()
                .result(roomService.getAllByService(serviceId, pageable))
                .build();
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ApiResponse<RoomResponse> getById(@PathVariable int id) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.getById(id))
                .build();
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable int id) {
        roomService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Room deleted successfully")
                .build();
    }

    @PostMapping("/{id}/increment")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> incrementInUse(@PathVariable int id) {
        roomService.incrementInUse(id);
        return ApiResponse.<Void>builder()
                .message("Room usage incremented successfully")
                .build();
    }

    @PostMapping("/{id}/decrement")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> decrementInUse(@PathVariable int id) {
        roomService.decrementInUse(id);
        return ApiResponse.<Void>builder()
                .message("Room usage decremented successfully")
                .build();
    }

    @PostMapping("/{roomId}/services/{serviceId}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoomResponse> addService(
            @PathVariable int roomId,
            @PathVariable int serviceId) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.addService(roomId, serviceId))
                .build();
    }

    @DeleteMapping("/{roomId}/services/{serviceId}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoomResponse> removeService(
            @PathVariable int roomId,
            @PathVariable int serviceId) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.removeService(roomId, serviceId))
                .build();
    }
}