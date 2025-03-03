package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.ServicesMapper;
import com.SWP.SkinCareService.repository.RoomRepository;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesService {
    ServicesRepository servicesRepository;
    ServicesMapper servicesMapper;
    ServiceCategoryRepository serviceCategoryRepository;
    private RoomRepository roomRepository;
    TherapistRepository therapistRepository;

    @Transactional
    public ServicesResponse create(ServicesRequest request){
        if(servicesRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.SERVICE_EXIST);
        }
        Room newRoom = checkRoom(request.getRoomId());
        ServiceCategory category = checkServiceCategory(request.getServiceCategoryId());
        Therapist therapist = checkTherapist(request.getTherapistId());
        //Get therapist
        List<Therapist> therapistsList = new ArrayList<>();
        therapistsList.add(therapist);
        //Get Room
        List<Room> rooms = new ArrayList<>();
        rooms.add(newRoom);
        //Convert request to entity
        Services service = servicesMapper.toServices(request);
        //Assign therapist, room, category to service
        service.setTherapists(therapistsList);
        service.setRooms(rooms);
        service.setServiceCategory(category);
        service = servicesRepository.save(service);
        //Save service to therapist - save
        therapist.getServices().add(service);
        therapistRepository.save(therapist);
        //Save service to room - save
        newRoom.getServices().add(service);
        roomRepository.save(newRoom);

        serviceCategoryRepository.flush();
        return servicesMapper.toResponse(service);
    }

    public ServicesResponse getById(int id){
        return servicesMapper.toResponse(checkService(id));
    }

    public List<ServicesResponse> getAll(){
        return servicesRepository.findAll().stream().map(servicesMapper::toResponse).toList();
    }

    @Transactional
    public ServicesResponse update(int id, ServicesUpdateRequest request){
        Services service = checkService(id);
        servicesMapper.update(request, service);
        //Get category - assign category
        ServiceCategory category = checkServiceCategory(request.getServiceCategoryId());
        service.setServiceCategory(category);
        //Remove service in old room
        for (Room oldRoom : service.getRooms()){
            oldRoom.getServices().remove(service);
            roomRepository.save(oldRoom);
        }
        //Get new room
        Room newRoom = checkRoom(request.getRoomId());
        //Assign service - save
        newRoom.getServices().add(service);
        roomRepository.save(newRoom);
        //Clear the old room in service
        service.getRooms().clear();
        //Add new room
        service.getRooms().add(newRoom);

        //Remove service in old therapist
        for (Therapist oldTherapist : service.getTherapists()){
            oldTherapist.getServices().remove(service);
            therapistRepository.save(oldTherapist);
        }
        //Get new therapist
        Therapist newTherapist = checkTherapist(request.getTherapistId());
        //Assign service - save
        newTherapist.getServices().add(service);
        therapistRepository.save(newTherapist);
        //Clear old therapist in service
        service.getTherapists().clear();
        //Add new therapist
        service.getTherapists().add(newTherapist);

        servicesRepository.save(service);
        return servicesMapper.toResponse(service);
    }

    @Transactional
    public void activate(int id){
        Services service = checkService(id);
        if(service.isActive())
            throw new AppException(ErrorCode.ACTIVATED);
        service.setActive(true);
        servicesRepository.save(service);
    }

    @Transactional
    public void deactivate(int id){
        Services service = checkService(id);
        if(!service.isActive())
            throw new AppException(ErrorCode.DEACTIVATED);
        service.setActive(false);
        servicesRepository.save(service);
    }

    @Transactional
    public void delete(int id){
        Services service = checkService(id);
        servicesRepository.delete(service);
    }

    private Services checkService(int id){
        return servicesRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }
    private ServiceCategory checkServiceCategory(int id){
        return serviceCategoryRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }

    private Therapist checkTherapist(String id){
        return therapistRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }

    private Room checkRoom(int id){
        return roomRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
    }

}
