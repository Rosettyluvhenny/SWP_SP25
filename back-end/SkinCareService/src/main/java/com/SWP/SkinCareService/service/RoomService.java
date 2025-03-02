package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.RoomRequest;
import com.SWP.SkinCareService.dto.response.RoomResponse;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.repository.RoomRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    @Autowired
    private ServicesRepository servicesRepository;

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::convertToResponse)
                .toList();
    }

    public RoomResponse getRoomById(int id) {
        return roomRepository.findById(id)
                .map(this::convertToResponse)
                .orElse(null);
    }

    public RoomResponse createRoom(RoomRequest request) {
        Room room = convertToEntity(request);
        return convertToResponse(roomRepository.save(room));
    }

    public RoomResponse updateRoomById(int id, RoomRequest request) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    existingRoom.setRoomName(request.getRoomName());
                    existingRoom.setCapacity(request.getCapacity());
                    existingRoom.setInUse(request.getInUse());
                    return convertToResponse(roomRepository.save(existingRoom));
                })
                .orElse(null);
    }

    public boolean deleteRoomById(int id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Chuyển đổi từ entity -> response DTO
    private RoomResponse convertToResponse(Room room) {
        List<Services> services = room.getServices();
        return RoomResponse.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .capacity(room.getCapacity())
                .inUse(room.getInUse())
                .services(services)
                .build();
    }

    // Chuyển đổi từ request DTO -> entity
    private Room convertToEntity(RoomRequest request) {
        return Room.builder()
                .roomName(request.getRoomName())
                .capacity(request.getCapacity())
                .inUse(request.getInUse())
                .build();
    }
}
