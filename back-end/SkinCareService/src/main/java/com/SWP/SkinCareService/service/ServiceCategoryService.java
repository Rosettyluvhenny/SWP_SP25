package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Services.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.Services.ServiceCategoryResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.ServiceCategoryMapper;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceCategoryService {
    ServiceCategoryRepository serviceCategoryRepository;
    ServiceCategoryMapper serviceCategoryMapper;
    @Transactional
    public ServiceCategoryResponse create(ServiceCategoryRequest request){
        if(serviceCategoryRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.CATEGORY_EXIST);
        }
        ServiceCategory category = serviceCategoryMapper.toCategory(request);
        category = serviceCategoryRepository.save(category);
        serviceCategoryRepository.flush();
        return serviceCategoryMapper.toResponse(category);
    }
    @Transactional
    public ServiceCategoryResponse update(int id,ServiceCategoryRequest request){
        ServiceCategory category = checkServiceCategory(id);
        serviceCategoryMapper.update(category, request);
        category = serviceCategoryRepository.save(category);
        serviceCategoryRepository.flush();
        return serviceCategoryMapper.toResponse(category);
    }
    @Transactional
    public void delete(int id){
        ServiceCategory category = checkServiceCategory(id);
        serviceCategoryRepository.delete(category);
    }
    public List<ServiceCategoryResponse> getAll(){
        return serviceCategoryRepository.findAll().stream().map(serviceCategoryMapper::toResponse).toList();
    }

    public ServiceCategoryResponse getById(int id){
        return serviceCategoryMapper.toResponse(checkServiceCategory(id));
    }

    private ServiceCategory checkServiceCategory(int id){
        return serviceCategoryRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }

}
