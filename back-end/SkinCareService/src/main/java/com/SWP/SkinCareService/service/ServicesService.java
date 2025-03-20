package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Services.AssignTherapistRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.exception.MultipleParameterValidationException;
import com.SWP.SkinCareService.mapper.ServicesMapper;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesService {
    ServicesRepository servicesRepository;
    ServicesMapper servicesMapper;
    ServiceCategoryRepository serviceCategoryRepository;
    SupabaseService supabaseService;
    TherapistRepository therapistRepository;

    @Transactional
    public ServicesResponse create(ServicesRequest request, MultipartFile img) throws IOException {
        if(servicesRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.SERVICE_EXIST);
        }
        if(img == null || img.isEmpty())
            throw new MultipleParameterValidationException(Collections.singletonList("img"));

        ServiceCategory category = serviceCategoryRepository.findById(request.getServiceCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        Services service = servicesMapper.toServices(request);
        service.setServiceCategory(category);
        service = servicesRepository.save(service);
        String serviceImg = supabaseService.uploadImage(img, "service_" + service.getId());
        service.setImg(serviceImg);

        servicesRepository.flush();
        return servicesMapper.toResponse(service);
    }

    public ServicesResponse getById(int id) throws IOException {
        var result = servicesMapper.toResponse(checkService(id));
        //result.setImg(supabaseService.getImage(result.getImg()));
        return result;
    }

    public Page<ServicesResponse> getAll(boolean isActive,Float rating, Integer categoryId, Integer quizResultId,Pageable pageable) {
        Specification<Services> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by rating (if provided)
            if (rating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), rating));
            }

            // Filter by categoryId (if provided)
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("serviceCategory").get("id"), categoryId));
            }
            if (quizResultId != null) {
                predicates.add(cb.equal(root.get("quizResults").get("id"), quizResultId));
            }


            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<Services> services = isActive ? servicesRepository.findAllByActiveTrue(spec, pageable) : servicesRepository.findAll(spec, pageable);
        /*
        return services
                .map(service -> {
                    var response = servicesMapper.toResponse(service);
                    response.setImg(supabaseService.getImage(response.getImg()));
                    return response;

                });
         */
        return services.map(servicesMapper::toResponse);
    }

    @Transactional
    public ServicesResponse update(int id, ServicesUpdateRequest request, MultipartFile img) throws IOException {
        Services service = checkService(id);
        servicesMapper.update(request, service);
        if(img == null || img.isEmpty()){

        }
        else {
            supabaseService.deleteImage(service.getImg());
            String serviceImg = supabaseService.uploadImage(img, "service_" + service.getId());
            service.setImg(serviceImg);
        }
        ServiceCategory category = checkServiceCategory(request.getServiceCategoryId());
        service.setServiceCategory(category);
        servicesRepository.save(service);
        return servicesMapper.toResponse(service);
    }

    @Transactional
    public void activate(int id) {
        Services service = checkService(id);
        if(service.isActive())
            throw new AppException(ErrorCode.ACTIVATED);
        service.setActive(true);
        servicesRepository.save(service);
    }

    @Transactional
    public void deactivate(int id) {
        Services service = checkService(id);
        if(!service.isActive())
            throw new AppException(ErrorCode.DEACTIVATED);
        service.setActive(false);
        servicesRepository.save(service);
    }

    @Transactional
    public void delete(int id) throws IOException {
        Services service = checkService(id);
        supabaseService.deleteImage(service.getImg());
        servicesRepository.delete(service);
    }

    private Services checkService(int id) {
        return servicesRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    private ServiceCategory checkServiceCategory(int id) {
        return serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }

    //Add
    @Transactional
    public void assignTherapistToService(int id, AssignTherapistRequest request) {
        Services service = checkService(id);
        Therapist therapist = therapistRepository.findById(request.getTherapistId()).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
        //Add therapist to service
        service.getTherapists().add(therapist);
        servicesRepository.save(service);
        //Add service to therapist
        therapist.getServices().add(service);
        therapistRepository.save(therapist);
    }

}
