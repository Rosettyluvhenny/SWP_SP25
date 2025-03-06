package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.RoomMapper;
import com.SWP.SkinCareService.repository.RoomRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService {
    RoomRepository roomRepository;
    ServicesRepository servicesRepository;
    RoomMapper roomMapper;

    @Transactional
    public RoomResponse create(RoomRequest request) {
        if (roomRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }
        Room room = roomMapper.toRoom(request);
        
        List<Services> services = new ArrayList<>();
        if (request.getServiceIds() != null && !request.getServiceIds().isEmpty()) {
            List<Services> servicesList = servicesRepository.findAllById(request.getServiceIds());
            if (servicesList.size() != request.getServiceIds().size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            services.addAll(servicesList);
        }
        room.setServices(services);
        roomRepository.save(room);
        return roomMapper.toResponse(room);
    }

    @Transactional
    public RoomResponse update(int id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        if (!room.getName().equals(request.getName()) && roomRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }
        roomMapper.update(room, request);

        List<Services> services = new ArrayList<>();
        if (request.getServiceIds() != null && !request.getServiceIds().isEmpty()) {
            List<Services> servicesList = servicesRepository.findAllById(request.getServiceIds());
            if (servicesList.size() != request.getServiceIds().size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            services.addAll(servicesList);
        }
        room.setServices(services);
        roomRepository.save(room);
        return roomMapper.toResponse(room);
    }

    @Transactional(readOnly = true)
    public Page<RoomResponse> getAll(Pageable pageable) {
        return roomRepository.findAll(pageable)
                .map(room -> {
                    List<Services> services = new ArrayList<>(room.getServices());
                    Room roomCopy = Room.builder()
                            .id(room.getId())
                            .name(room.getName())
                            .capacity(room.getCapacity())
                            .inUse(room.getInUse())
                            .services(services)
                            .createdAt(room.getCreatedAt())
                            .updatedAt(room.getUpdatedAt())
                            .build();
                    return roomMapper.toResponse(roomCopy);
                });
    }

    @Transactional(readOnly = true)
    public Page<RoomResponse> getAllByService(int serviceId, Pageable pageable) {
        return roomRepository.findAllByServicesId(serviceId, pageable)
                .map(room -> {
                    List<Services> services = new ArrayList<>(room.getServices());
                    Room roomCopy = Room.builder()
                            .id(room.getId())
                            .name(room.getName())
                            .capacity(room.getCapacity())
                            .inUse(room.getInUse())
                            .services(services)
                            .createdAt(room.getCreatedAt())
                            .updatedAt(room.getUpdatedAt())
                            .build();
                    return roomMapper.toResponse(roomCopy);
                });
    }

    @Transactional(readOnly = true)
    public RoomResponse getById(int id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        List<Services> services = new ArrayList<>(room.getServices());
        Room roomCopy = Room.builder()
                .id(room.getId())
                .name(room.getName())
                .capacity(room.getCapacity())
                .inUse(room.getInUse())
                .services(services)
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
        return roomMapper.toResponse(roomCopy);
    }

    @Transactional
    public void delete(int id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        if (room.getInUse() > 0) {
            throw new AppException(ErrorCode.ROOM_IN_USE);
        }

        roomRepository.delete(room);
    }

    @Transactional
    public RoomResponse addService(int roomId, int serviceId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        List<Services> services = new ArrayList<>(room.getServices());
        if (services.contains(service)) {
            throw new AppException(ErrorCode.SERVICE_ALREADY_EXISTS);
        }

        services.add(service);
        room.setServices(services);
        roomRepository.save(room);
        return roomMapper.toResponse(room);
    }

    @Transactional
    public RoomResponse removeService(int roomId, int serviceId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        List<Services> services = new ArrayList<>(room.getServices());
        if (!services.contains(service)) {
            throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
        }

        services.remove(service);
        room.setServices(services);
        roomRepository.save(room);
        return roomMapper.toResponse(room);
    }

    @Transactional
    public void incrementInUse(int id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        if (room.getInUse() >= room.getCapacity()) {
            throw new AppException(ErrorCode.ROOM_FULL);
        }

        room.setInUse(room.getInUse() + 1);
        roomRepository.save(room);
    }

    @Transactional
    public void decrementInUse(int id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        if (room.getInUse() <= 0) {
            throw new AppException(ErrorCode.ROOM_EMPTY);
        }

        room.setInUse(room.getInUse() - 1);
        roomRepository.save(room);
    }
} 