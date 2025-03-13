package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Therapist.GetScheduleRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistResponse;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistSummaryResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.ServicesMapper;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Slf4j
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
    ServicesMapper servicesMapper;
    PasswordEncoder passwordEncoder;
    BookingSessionRepository bookingSessionRepository;

    @Transactional
    public TherapistResponse create(TherapistRequest request, MultipartFile img) throws IOException {
        // Validate user existence first
        if(userRepository.existsByUsername(request.getUsername()) || userRepository.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User account = therapistMapper.toUser(request);
        Role roleTherapist = roleRepository.findById("THERAPIST")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        Set<Role> roles = new HashSet<>();
        roles.add(roleTherapist);
        account.setRoles(roles);
        account.setActive(true);
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        log.info(account.getPassword());
        account = userRepository.save(account);
        Therapist therapist = therapistMapper.toTherapist(request);
        therapist.setUser(account);
        List<Integer> serviceIds = request.getServiceId();
        if(serviceIds == null || serviceIds.isEmpty()){

        }else{
            Set<Services> services =  new HashSet<>(servicesRepository.findAllById(serviceIds));
            if(services.size()!= serviceIds.size())
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            therapist.setServices(services);
        }

        therapist = therapistRepository.save(therapist);
        String imageUrl = supabaseService.uploadImage(img, "therapist_" + therapist.getId());
        therapist.setImg(imageUrl);
        therapist = therapistRepository.save(therapist);
        therapistRepository.flush();
        return therapistMapper.toResponse(therapist);



    }

    public Page<TherapistResponse> findAll(boolean isActive, Pageable pageable){
        Page<Therapist> therapists = isActive ? therapistRepository.findAll(pageable): therapistRepository.findInactiveTherapists(pageable);

        return therapists
                .map(therapist -> {
                    List<Services> services = new ArrayList<>(therapist.getServices());
                    TherapistResponse response = therapistMapper.toResponse(therapist);
                    response.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
                    response.setImg(supabaseService.getImage(response.getImg()));
                    return response;
                });
    }

    public TherapistResponse findById(String id){
        Therapist therapist = therapistRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
        List<Services> services = new ArrayList<>(therapist.getServices());
        TherapistResponse response = therapistMapper.toResponse(therapist);
        response.setServices(services.stream().map(servicesMapper::toSummaryResponse).toList());
        return response;
    }

    private Therapist therapistCheck (String id){
        return therapistRepository.findById(id).orElseThrow((
                ()->new AppException(ErrorCode.THERAPIST_NOT_EXISTED)));
    }

    @Transactional
    public TherapistResponse update (String id, TherapistUpdateRequest request, MultipartFile img) throws IOException {
        Therapist therapist = therapistRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));

        therapistMapper.update(therapist, request);
        if(request.getServiceIds() == null || request.getServiceIds().isEmpty()){

        }else {
            Set<Integer> serviceId = new HashSet<>(request.getServiceIds());
            Set<Services> services = new HashSet<>(servicesRepository.findAllById(serviceId));
            if (services.size() != request.getServiceIds().size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            therapist.setServices(services);
        }
        if(img!=null){
            try {
                supabaseService.deleteImage(therapist.getImg());
                String imgUrl = supabaseService.uploadImage(img,"therapist_" + therapist.getId());
            }catch(IOException e){
                log.info(e.getMessage());
            }
        }
        therapistRepository.save(therapist);
        TherapistResponse response =  therapistMapper.toResponse(therapist);
        response.setServices(therapist.getServices().stream().map(servicesMapper::toSummaryResponse).toList());
        return response;
    }

    @Transactional
    public void disable (String id){
        Therapist therapist = therapistCheck(id);
        User user = therapist.getUser();
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void delete (String id) {
        Therapist therapist = therapistCheck(id);
        User user = therapist.getUser();
        if (user.isActive()) {
            throw new AppException(ErrorCode.STILL_ACTIVE);
        } else {
            userRepository.delete(user);
            therapist.getServices().clear();
            therapistRepository.delete(therapist);
        }
    }

    @Transactional(readOnly = true)
    public Page<TherapistSummaryResponse> getAllByServiceId(int therapistId, Pageable pageable) {
        return therapistRepository.findAllByServicesId(therapistId, pageable)
                .map(therapist -> {
                    List<Services> services = new ArrayList<>(therapist.getServices());
                    TherapistSummaryResponse response = therapistMapper.toTherapistSummary(therapist);
                    response.setImg(supabaseService.getImage(therapist.getImg()));
                    return response;
                });
    }
    //Get list therapist available for booking service request
    public List<Therapist> getTherapistAvailableForService(int serviceId, LocalDateTime startTime) {
        Services services = servicesRepository.findById(serviceId).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        int duration = services.getDuration();

        List<Services> findByService = new ArrayList<>();
        findByService.add(services);

        LocalDateTime endTime = startTime.plusMinutes(duration);
        LocalDateTime startOfDay = startTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELLED);
        List<BookingSession> bookingSessionList = bookingSessionRepository.findAllBySessionDateTimeBetweenAndStatusNotIn(startOfDay, endOfDay, excludeStatus);
        List<Therapist> therapistList = therapistRepository.findTherapistByServices(findByService);
        Set<Therapist> therapistsNotAvailable = new HashSet<>();

        for (BookingSession bookingSession : bookingSessionList) {
            LocalDateTime existingStartTime = bookingSession.getSessionDateTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(bookingSession.getBooking().getService().getDuration());


            if (!(endTime.isBefore(existingStartTime) || startTime.isAfter(existingEndTime))) {
                therapistsNotAvailable.add(bookingSession.getTherapist());
            }
        }

        therapistList.removeAll(therapistsNotAvailable);

        if (therapistList.isEmpty()) {
            return List.of();
        }
        return therapistList;
    }
    //Get list therapist free in time
    public List<TherapistResponse> getTherapistAvailableInTime(GetScheduleRequest request) {

        LocalDateTime time = request.getTime();
        LocalDateTime endTime = time.plusMinutes(59);
        endTime = endTime.plusSeconds(59);

        LocalDateTime startOfDay = time.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELLED);
        List<BookingSession> bookingSessionList = bookingSessionRepository.findAllBySessionDateTimeBetweenAndStatusNotIn(startOfDay, endOfDay, excludeStatus);
        List<Therapist> therapistList = therapistRepository.findAll();
        Set<Therapist> therapistsNotAvailable = new HashSet<>();

        for (BookingSession bookingSession : bookingSessionList) {
            LocalDateTime existingStartTime = bookingSession.getSessionDateTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(bookingSession.getBooking().getService().getDuration());


            if (!(endTime.isBefore(existingStartTime) || time.isAfter(existingEndTime))) {
                therapistsNotAvailable.add(bookingSession.getTherapist());
            }
        }

        therapistList.removeAll(therapistsNotAvailable);

        if (therapistList.isEmpty()) {
            return List.of();
        }
        return therapistList.stream().map(therapistMapper::toResponse).toList();
    }
}
