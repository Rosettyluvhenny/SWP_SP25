package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Services.ServiceInfoRequest;
import com.SWP.SkinCareService.dto.request.Services.ServiceInfoUpdateRequest;
import com.SWP.SkinCareService.dto.response.Services.ServiceInfoResponse;
import com.SWP.SkinCareService.entity.ServiceInfo;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.exception.MultipleParameterValidationException;
import com.SWP.SkinCareService.repository.ServiceInfoRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceInfoService {
    ServiceInfoRepository serviceInfoRepository;
    ServicesRepository servicesRepository;
    SupabaseService supabaseService;

    @Transactional
    public ServiceInfoResponse createServiceInfo(ServiceInfoRequest request,MultipartFile serviceImg, MultipartFile desImg,
                                                 MultipartFile techImg, MultipartFile mechaImg) throws IOException {
        Services service = servicesRepository.findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_EXIST));

        validateFiles(serviceImg, desImg, techImg, mechaImg);

        String serviceImgUrl =  supabaseService.uploadImage(serviceImg, "service_" + service.getId());
        String desImgUrl =  supabaseService.uploadImage(desImg, "des_service_" + service.getId());
        String techImgUrl =   supabaseService.uploadImage(techImg, "tech_service_" + service.getId());
        String mechaImgUrl = supabaseService.uploadImage(mechaImg, "mecha_service_" + service.getId());

        ServiceInfo serviceInfo = ServiceInfo.builder()
                .service(service)
                .description(request.getDescription())
                .desImgUrl(desImgUrl)
                .tech(request.getTech())
                .techImgUrl(techImgUrl)
                .mechanism(request.getMechanism())
                .mechaImgUrl(mechaImgUrl)
                .serviceImgUrl(serviceImgUrl)
                .build();

        serviceInfoRepository.save(serviceInfo);
        return toResponse(serviceInfo);
    }

    @Transactional
    public ServiceInfoResponse updateServiceInfo(int id, ServiceInfoUpdateRequest request, MultipartFile serviceImg, MultipartFile desImg,
                                                 MultipartFile techImg, MultipartFile mechaImg) throws IOException {
        ServiceInfo serviceInfo = serviceInfoRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        if (serviceImg != null && !serviceImg.isEmpty()) {
            supabaseService.deleteImage(serviceInfo.getServiceImgUrl());
            serviceInfo.setDesImgUrl(supabaseService.uploadImage(serviceImg, "service_" + serviceInfo.getService().getId()));
        }
        if (desImg != null && !desImg.isEmpty()) {
            supabaseService.deleteImage(serviceInfo.getDesImgUrl());
            serviceInfo.setDesImgUrl(supabaseService.uploadImage(desImg, "des_service_" + serviceInfo.getService().getId()));
        }
        if (techImg != null && !techImg.isEmpty()) {
            supabaseService.deleteImage(serviceInfo.getTechImgUrl());
            serviceInfo.setTechImgUrl(supabaseService.uploadImage(techImg, "tech_service_" +  serviceInfo.getService().getId()));
        }
        if (mechaImg != null && !mechaImg.isEmpty()) {
            supabaseService.deleteImage(serviceInfo.getMechaImgUrl());
            serviceInfo.setMechaImgUrl(supabaseService.uploadImage(mechaImg, "mecha_service_" +  serviceInfo.getService().getId()));
        }

        // Update text fields
        if(request.getDescription()!=null && !request.getDescription().isBlank() )
           serviceInfo.setDescription(request.getDescription());
        if(request.getTech()!=null && !request.getTech().isBlank())
            serviceInfo.setTech(request.getTech());
        if(request.getMechanism()!=null && !request.getMechanism().isBlank())
            serviceInfo.setMechanism(request.getMechanism());

        serviceInfoRepository.save(serviceInfo);
        return toResponse(serviceInfo);
    }

    public void deleteServiceInfo(int id) throws IOException {

        ServiceInfo serviceInfo = getServiceInfoById(id);

        if (serviceInfo != null) {
            supabaseService.deleteImage(serviceInfo.getServiceImgUrl());
            supabaseService.deleteImage(serviceInfo.getDesImgUrl());
            supabaseService.deleteImage(serviceInfo.getTechImgUrl());
            supabaseService.deleteImage(serviceInfo.getMechaImgUrl());
            serviceInfo.getService().setServiceInfo(null);
            serviceInfoRepository.delete(serviceInfo);
        }
    }

    public ServiceInfoResponse getServiceInfo(int id) throws IOException {
        return toResponse(getServiceInfoById(id));
    }

    private ServiceInfo getServiceInfoById(int id) {
        return serviceInfoRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_INFO_NOT_FOUND));
    }

    private void validateFiles(MultipartFile serviceImg, MultipartFile desImg, MultipartFile techImg, MultipartFile mechaImg) {
        List<String> missingParams = new ArrayList<>();
        if (serviceImg == null || serviceImg.isEmpty()) {
            missingParams.add("serviceImg");
        }

        if (desImg == null || desImg.isEmpty()) {
            missingParams.add("desImg");
        }
        if (techImg == null || techImg.isEmpty()) {
            missingParams.add("techImg");
        }
        if (mechaImg == null || mechaImg.isEmpty()) {
            missingParams.add("mechaImg");
        }
        if (!missingParams.isEmpty()) {
            throw new MultipleParameterValidationException(missingParams);
        }
    }
    private ServiceInfoResponse toResponse(ServiceInfo info) throws IOException {
        return ServiceInfoResponse.builder()
                .id(info.getId())
                .service(info.getService())
                .description(info.getDescription())
                .tech(info.getTech())
                .mechanism(info.getMechanism())
                .serviceImgUrl(supabaseService.getImage(info.getServiceImgUrl()))
                .desImgUrl(supabaseService.getImage(info.getDesImgUrl()))
                .techImgUrl(supabaseService.getImage(info.getTechImgUrl()))
                .mechaImgUrl(supabaseService.getImage(info.getMechaImgUrl()))
                .build();
    }
}

