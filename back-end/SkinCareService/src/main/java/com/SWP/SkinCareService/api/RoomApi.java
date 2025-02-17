package com.SWP.SkinCareService.api;

import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomApi {
    @Autowired
    private RoomService roomService;

    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping()
    public ResponseEntity<Room> getRoomById(@RequestParam Long id) {
        Room room = roomService.getRoomById(id);
        return (room != null) ? ResponseEntity.ok(room)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(room));
    }

    @PutMapping("/update")
    public ResponseEntity<Room> updateRoom(@RequestParam Long id, @RequestBody Room updatedRoom) {
        Room room = roomService.updateRoomById(id, updatedRoom);
        return (room != null) ? ResponseEntity.ok(room)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteRoom(@RequestParam Long id) {
        boolean isDeleted = roomService.deleteRoomById(id);
        return isDeleted ? ResponseEntity.ok("Room deleted successfully.")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found.");
    }
}
