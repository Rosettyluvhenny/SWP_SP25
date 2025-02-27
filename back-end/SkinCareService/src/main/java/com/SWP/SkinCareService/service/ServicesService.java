package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.ServicesMapper;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesService {
    ServicesRepository servicesRepository;
    ServicesMapper servicesMapper;
    ServiceCategoryRepository serviceCategoryRepository;

    @Transactional
    public ServicesResponse create(ServicesRequest request){
        if(servicesRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.SERVICE_EXIST);
        }
        ServiceCategory category = serviceCategoryRepository.findById(request.getServiceCategoryId()).orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        Services service = servicesMapper.toServices(request);
        service.setServiceCategory(category);
        service = servicesRepository.save(service);
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
        ServiceCategory category = checkServiceCategory(request.getServiceCategoryId());
        service.setServiceCategory(category);
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

}
