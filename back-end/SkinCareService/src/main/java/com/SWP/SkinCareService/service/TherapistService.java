package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.TherapistResponse;
import com.SWP.SkinCareService.entity.Role;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.exception.MultipleParameterValidationException;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.repository.RoleRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TherapistService {
    UserRepository userRepository;
    TherapistRepository therapistRepository;
    RoleRepository roleRepository;
    TherapistMapper therapistMapper;
    ServicesRepository servicesRepository;
    SupabaseService supabaseService;

    @Transactional
    public TherapistResponse create(TherapistRequest request, MultipartFile img) throws IOException {
            if(userRepository.existsByUsername(request.getUsername())||userRepository.existsByEmail(request.getEmail())){
                throw new AppException(ErrorCode.USER_EXISTED);
            }
            User account = therapistMapper.toUser(request);
            Role roleTherapist = roleRepository.findById("THERAPIST").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
            Set<Role> roles = new HashSet<>();
            roles.add(roleTherapist);
            account.setRoles(roles);
            account.setActive(true);
            account = userRepository.save(account);

            Therapist therapist = therapistMapper.toTherapist(request);
            therapist.setUser(account);
            therapist = therapistRepository.save(therapist);

            therapist.setImg(supabaseService.uploadImage(img,"therapist_"+therapist.getId()));

            return therapistMapper.toTherapistResponse(therapist);

    }

    public List<TherapistResponse> findAll(){
        return therapistRepository.findAll().stream().map(therapistMapper::toTherapistResponse).toList();
    }

    public TherapistResponse findById(String id){
        return therapistMapper.toTherapistResponse(therapistCheck(id));
    }

    private Therapist therapistCheck (String id){
        return therapistRepository.findById(id).orElseThrow((
                ()->new AppException(ErrorCode.THERAPIST_NOT_EXISTED)));
    }
    public TherapistResponse update (String id, TherapistUpdateRequest request
            ,MultipartFile img) throws IOException {
        Therapist therapist = therapistCheck(id);
        therapistMapper.update(request, therapist);
        if(img == null || img.isEmpty())
            throw new MultipleParameterValidationException(Collections.singletonList("img"));
        else {
            supabaseService.deleteImage(therapist.getImg());
            String serviceImg = supabaseService.uploadImage(img, "service_" + therapist.getId());
            therapist.setImg(serviceImg);
        }
        therapistRepository.save(therapist);
        return therapistMapper.toTherapistResponse(therapist);
    }

    public void disable (String id){
        Therapist therapist = therapistCheck(id);
        User user = therapist.getUser();
        user.setActive(false);
        userRepository.save(user);
    }

    public void delete (String id) {
        Therapist therapist = therapistCheck(id);
        User user = therapist.getUser();
        if (user.isActive()) {
            throw new AppException(ErrorCode.STILL_ACTIVE);
        } else {
            userRepository.delete(user);
            therapistRepository.delete(therapist);
        }
    }

    @Transactional
    public Therapist addService(String therapistId, int serviceId) {
        Therapist therapist = therapistRepository.findById(therapistId)
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        List<Services> services = new ArrayList<>(therapist.getServices());
        if (services.contains(service)) {
            throw new AppException(ErrorCode.SERVICE_ALREADY_EXISTS);
        }

        therapist.addService(service);
        return therapistRepository.save(therapist);
    }

    @Transactional
    public Therapist removeService(String therapistId, int serviceId) {
        Therapist therapist = therapistRepository.findById(therapistId)
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        List<Services> services = new ArrayList<>(therapist.getServices());
        if (!services.contains(service)) {
            throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
        }

        therapist.removeService(service);
        return therapistRepository.save(therapist);
    }

    @Transactional(readOnly = true)
    public Page<Therapist> findTherapistsByService(int serviceId, Pageable pageable) {
        if (!servicesRepository.existsById(serviceId)) {
            throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
        }
        return therapistRepository.findAllByServicesId(serviceId, pageable);
    }
}
