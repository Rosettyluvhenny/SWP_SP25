package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.RoomRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.RoomResponse;
import com.SWP.SkinCareService.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping()
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(@RequestBody RoomRequest request) {
        var result = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<RoomResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms() {
        var result = roomService.getAllRooms();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<RoomResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomsById(@PathVariable int id) {
        var result = roomService.getRoomById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<RoomResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(@PathVariable int id, @RequestBody RoomRequest request) {
        var result = roomService.updateRoomById(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<RoomResponse>builder().result(result).build()
        );
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
