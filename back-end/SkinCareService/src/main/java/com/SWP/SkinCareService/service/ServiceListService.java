package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.entity.ServiceList;
import com.SWP.SkinCareService.repository.ServiceListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServiceListService {
    @Autowired
    private ServiceListRepository serviceRepository;

    public List<ServiceList> getAllServices() {
        return serviceRepository.findAll();
    }

    public ServiceList getServiceById(Long id) {
        return serviceRepository.findById(id).orElse(null);
    }

    public ServiceList createService(ServiceList service) {
        return serviceRepository.save(service);
    }

    public ServiceList updateServiceById(Long id, ServiceList updatedService) {
        return serviceRepository.findById(id).map(service -> {
            service.setServiceName(updatedService.getServiceName());
            service.setCategoryId(updatedService.getCategoryId());
            service.setSubTitle(updatedService.getSubTitle());
            service.setDescription(updatedService.getDescription());
            service.setPrice(updatedService.getPrice());
            service.setDurationMinutes(updatedService.getDurationMinutes());
            service.setSession(updatedService.getSession());
            service.setStatus(updatedService.getStatus());
            return serviceRepository.save(service);
        }).orElse(null);
    }

    public boolean deleteServiceById(Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
