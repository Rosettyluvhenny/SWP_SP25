package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.ServiceRequest;
import com.SWP.SkinCareService.dto.response.ServiceResponse;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.RoomRepository;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicesService {
    private final ServicesRepository serviceRepository;
    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;
    @Autowired
    private RoomRepository roomRepository;

    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ServiceResponse getServiceById(Long id) {
        return serviceRepository.findById(id)
                .map(this::convertToResponse)
                .orElse(null);
    }

    public ServiceResponse createService(ServiceRequest request) {
        Services service = convertToEntity(request);
        return convertToResponse(serviceRepository.save(service));
    }

    public ServiceResponse updateServiceById(Long id, ServiceRequest request) {
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(request.getCategoryId()).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_CATEGORY_NOT_EXISTED));
        Room newRoom = roomRepository.findById(request.getRoomId()).orElseThrow(()
                -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        return serviceRepository.findById(id)
                .map(existingService -> {
                    existingService.setServiceName(request.getServiceName());
                    existingService.setSubTitle(request.getSubTitle());
                    existingService.setDescription(request.getDescription());
                    existingService.setPrice(request.getPrice());
                    existingService.setDurationMinutes(request.getDurationMinutes());
                    existingService.setSession(request.getSession());
                    existingService.setStatus(request.getStatus());

                    existingService.setServiceCategory(serviceCategory);

                    for (Room room : existingService.getRooms()) {
                        room.getServices().remove(existingService);
                        roomRepository.save(room);
                    }
                    newRoom.getServices().add(existingService);
                    roomRepository.save(newRoom);

                    existingService.getRooms().clear();
                    existingService.getRooms().add(newRoom);


                    return convertToResponse(serviceRepository.save(existingService));
                })
                .orElse(null);
    }

    public boolean deleteServiceById(Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Chuyển đổi từ entity -> response DTO
    private ServiceResponse convertToResponse(Services service) {

        List<Room> rooms = service.getRooms();
        List<QuizResult> quizResults = service.getQuizResults();

        return ServiceResponse.builder()
                .serviceId(service.getServiceId())
                .serviceName(service.getServiceName())
                .subTitle(service.getSubTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .session(service.getSession())
                .status(service.getStatus())
                .serviceCategory(service.getServiceCategory())
                .rooms(rooms)
                .quizResult(quizResults)
                .build();
    }

    // Chuyển đổi từ request DTO -> entity
    private Services convertToEntity(ServiceRequest request) {
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(request.getCategoryId()).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_CATEGORY_NOT_EXISTED));

        List<Room> roomList = new ArrayList<>();
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(()
                -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        roomList.add(room);

        Services service = Services.builder()
                .serviceName(request.getServiceName())
                .subTitle(request.getSubTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .session(request.getSession())
                .status(request.getStatus())
                .serviceCategory(serviceCategory)
                .rooms(roomList)
                .build();
        serviceRepository.save(service);

        room.getServices().add(service);

        roomRepository.save(room);

        return service;
    }
}