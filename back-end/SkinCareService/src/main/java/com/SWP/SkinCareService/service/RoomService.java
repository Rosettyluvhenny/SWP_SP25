package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoomById(Long id, Room updatedRoom) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomName(updatedRoom.getRoomName());
            room.setCapacity(updatedRoom.getCapacity());
            room.setInUse(updatedRoom.getInUse());
            return roomRepository.save(room);
        }).orElse(null);
    }

    public boolean deleteRoomById(Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
