package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoomController {
    RoomService roomService;

    @Operation(summary = "Create room")
    @PostMapping
    ResponseEntity<ApiResponse<RoomResponse>> createRoom(@RequestBody @Valid RoomRequest request) {
        var result = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<RoomResponse>builder().result(result).build()
        );
    }

    @Operation(summary = "Get all rooms")
    @GetMapping
    ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms() {
        var result = roomService.getAllRooms();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<RoomResponse>>builder().result(result).build()
        );
    }

    @Operation(summary = "Get room by ID")
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Integer id) {
        var result = roomService.getRoomById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<RoomResponse>builder().result(result).build()
        );
    }

    @Operation(summary = "Update room")
    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Integer id,
            @RequestBody @Valid RoomRequest request) {
        var result = roomService.updateRoom(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<RoomResponse>builder().result(result).build()
        );
    }

    @Operation(summary = "Delete room")
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Room deleted successfully").build()
        );
    }
} 