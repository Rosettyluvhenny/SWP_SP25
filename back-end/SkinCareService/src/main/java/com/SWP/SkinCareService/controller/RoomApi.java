package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.RoomRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.RoomResponse;
import com.SWP.SkinCareService.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomApi {
    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable int id) {
        RoomResponse room = roomService.getRoomById(id);
        if (room != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Success", room));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Room not found", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(@RequestBody RoomRequest request) {
        RoomResponse createdRoom = roomService.createRoom(request);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Room created successfully", createdRoom));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(@PathVariable int id, @RequestBody RoomRequest request) {
        RoomResponse updatedRoom = roomService.updateRoomById(id, request);
        if (updatedRoom != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Room updated successfully", updatedRoom));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Room not found", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable int id) {
        boolean deleted = roomService.deleteRoomById(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Room deleted successfully", null));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Room not found", null));
    }
}
