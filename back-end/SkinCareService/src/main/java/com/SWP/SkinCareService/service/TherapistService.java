package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.TherapistResponse;
import com.SWP.SkinCareService.entity.Role;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.repository.RoleRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TherapistService {
    UserRepository userRepository;
    TherapistRepository therapistRepository;
    RoleRepository roleRepository;
    TherapistMapper therapistMapper;

    @Transactional
    public TherapistResponse create(TherapistRequest request) {
            if(userRepository.existsByUsername(request.getUsername())||userRepository.existsByEmail(request.getEmail())){
                throw new AppException(ErrorCode.USER_EXISTED);
            }
            User account = therapistMapper.toUser(request);
            Role roleTherapist = roleRepository.findById("THERAPIST").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
            Set<Role> roles = new HashSet<>();
            roles.add(roleTherapist);
            account.setRoles(roles);
            account = userRepository.save(account);

            Therapist therapist = therapistMapper.toTherapist(request);
            therapist.setUser(account);
            therapist = therapistRepository.save(therapist);
            return therapistMapper.toTheRapistResponse(therapist);

    }

    public List<TherapistResponse> findAll(){
        return therapistRepository.findAll().stream().map(therapistMapper::toTheRapistResponse).toList();
    }

    public TherapistResponse findById(String id){
        return therapistMapper.toTheRapistResponse(therapistCheck(id));
    }

    private Therapist therapistCheck (String id){
        return therapistRepository.findById(id).orElseThrow((
                ()->new AppException(ErrorCode.THERAPIST_NOT_EXISTED)));
    }
    public TherapistResponse update (String id, TherapistUpdateRequest request){
        Therapist therapist = therapistCheck(id);
        therapistMapper.updateMapper(request, therapist);
        therapistRepository.save(therapist);
        return therapistMapper.toTheRapistResponse(therapist);
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
}
