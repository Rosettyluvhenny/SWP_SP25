package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.RoomMapper;
import com.SWP.SkinCareService.repository.RoomRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoomService {
    RoomRepository roomRepository;
    RoomMapper roomMapper;

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Room room = roomMapper.toRoom(request);
        roomRepository.save(room);
        return roomMapper.toRoomResponse(room);
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(roomMapper::toRoomResponse)
                .toList();
    }

    public RoomResponse getRoomById(Integer id) {
        return roomMapper.toRoomResponse(checkRoom(id));
    }

    @Transactional
    public RoomResponse updateRoom(Integer id, RoomRequest request) {
        Room room = checkRoom(id);
        roomMapper.updateRoom(room, request);
        roomRepository.save(room);
        return roomMapper.toRoomResponse(room);
    }

    @Transactional
    public void deleteRoom(Integer id) {
        Room room = checkRoom(id);
        roomRepository.delete(room);
    }

    private Room checkRoom(Integer id) {
        return roomRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
    }
} 