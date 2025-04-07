package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.request.Room.RoomUpdateRequest;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.RoomMapper;
import com.SWP.SkinCareService.mapper.ServicesMapper;
import com.SWP.SkinCareService.repository.BookingSessionRepository;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService {
    RoomRepository roomRepository;
    ServicesRepository servicesRepository;
    RoomMapper roomMapper;
    ServicesMapper servicesMapper;
    BookingSessionRepository bookingSessionRepository;
    @Transactional
    public RoomResponse create(RoomRequest request) {
        if (roomRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }
        Room room = roomMapper.toRoom(request);

        if(request.getServiceIds() == null && request.getServiceIds().isEmpty()){

        }else {
            Set<Integer> serviceId = new HashSet<>(request.getServiceIds());
            Set<Services> services = new HashSet<>(servicesRepository.findAllById(serviceId));
            if (services.size() != request.getServiceIds().size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            room.setServices(services);
        }
        roomRepository.save(room);
        RoomResponse response =  roomMapper.toResponse(room);
        response.setServices(room.getServices().stream().map(servicesMapper::toSummaryResponse).toList());
        return response;
    }

    @Transactional
    public RoomResponse update(int id, RoomUpdateRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        if (roomRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }

        roomMapper.update(room, request);
        if(request.getServiceIds() == null || request.getServiceIds().isEmpty()){

        }else {
            Set<Integer> serviceId = new HashSet<>(request.getServiceIds());
            Set<Services> services = new HashSet<>(servicesRepository.findAllById(serviceId));
            if (services.size() != request.getServiceIds().size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            room.setServices(services);
        }
        roomRepository.save(room);
        RoomResponse response =  roomMapper.toResponse(room);
        response.setServices(room.getServices().stream().map(servicesMapper::toSummaryResponse).toList());
        return response;
    }

    @Transactional(readOnly = true)
    public Page<RoomResponse> getAll(Pageable pageable) {
        return roomRepository.findAll(pageable)
                .map(room -> {
                    List<Services> services = new ArrayList<>(room.getServices());
                    RoomResponse roomCopy = roomMapper.toResponse(room);
                    roomCopy.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
                    return roomCopy;
                });
    }

    @Transactional(readOnly = true)
    public Page<RoomResponse> getAllByService(int serviceId, Pageable pageable) {
        return roomRepository.findAllByServicesId(serviceId, pageable)
                .map(room -> {
                    List<Services> services = new ArrayList<>(room.getServices());
                    RoomResponse roomCopy = roomMapper.toResponse(room);
                    roomCopy.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
                    return roomCopy;
                });
    }

    @Transactional(readOnly = true)
    public RoomResponse getById(int id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        List<Services> services = new ArrayList<>(room.getServices());
        RoomResponse roomCopy = roomMapper.toResponse(room);
        roomCopy.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
        return roomCopy;
    }

    @Transactional
    public void delete(int id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        if (room.getInUse() > 0) {
            throw new AppException(ErrorCode.ROOM_IN_USE);
        }else{
            room.getServices().clear();
        }
        roomRepository.delete(room);
    }

    @Transactional
    public RoomResponse addService(int roomId, int serviceId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        Set<Services> services = new HashSet<>(room.getServices());
        if (services.contains(service)) {
            throw new AppException(ErrorCode.SERVICE_ALREADY_EXISTS);
        }

        services.add(service);
        room.setServices(new HashSet<>(services));
        roomRepository.save(room);
        RoomResponse response = roomMapper.toResponse(room);
        response.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
        return response;
    }

    @Transactional
    public RoomResponse removeService(int roomId, int serviceId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        Set<Services> services = new HashSet<>(room.getServices());
        if (!services.contains(service)) {
            throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
        }
        List<BookingSession> bookingSessionList = bookingSessionRepository.findAllByRoomIdAndServiceIdAndStatusNotIn(roomId, serviceId, BookingSessionStatus.ON_GOING);
        if (!bookingSessionList.isEmpty()) {
            throw new AppException(ErrorCode.SERVICE_ON_GOING);
        }

        services.remove(service);
        room.setServices(services);
        roomRepository.save(room);
        RoomResponse response = roomMapper.toResponse(room);
        response.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
        return response;
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

    public List<Room> getRoomAvailableForService(int serviceId) {
        List<Room> rooms = roomRepository.findAllByServicesId(serviceId);
        List<Room> availableRooms = new ArrayList<>();
        for (Room room : rooms) {
            if (room.getCapacity() > room.getInUse()) {
                availableRooms.add(room);
            }
        }
        return availableRooms;
    }
    public List<RoomResponse> getRoomAvailableForServiceId(int serviceId) {
        List<Room> rooms = roomRepository.findAllByServicesId(serviceId);
        List<Room> availableRooms = rooms.stream()
                .filter(room -> room.getCapacity() > room.getInUse()) // Filter available rooms
                .sorted(Comparator.comparingInt(Room::getInUse)) // Sort by inUse ascending
                .toList();

        return availableRooms.stream().map(roomMapper::toResponse).toList();
    }
}