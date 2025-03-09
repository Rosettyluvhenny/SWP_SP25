package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Therapist.GetScheduleRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.TherapistResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Role;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.repository.BookingSessionRepository;
import com.SWP.SkinCareService.repository.RoleRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    PasswordEncoder passwordEncoder;
    BookingSessionRepository bookingSessionRepository;

    @Transactional
    public TherapistResponse create(TherapistRequest request) {
        if(userRepository.existsByUsername(request.getUsername())||userRepository.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User account = therapistMapper.toUser(request);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
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

    public List<Therapist> getTherapistAvailableForService(int serviceId, LocalDateTime startTime) {
        BookingSession session = bookingSessionRepository.findById(serviceId).orElseThrow(()
                -> new AppException(ErrorCode.SESSION_NOT_EXISTED));
        int duration = session.getBooking().getService().getDuration();
        LocalDateTime endTime = startTime.plusMinutes(duration);

        LocalDateTime startOfDay = startTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELED);
        List<BookingSession> bookingSessionList = bookingSessionRepository.findAllByBookingTimeBetweenAndStatusNotIn(startOfDay, endOfDay, excludeStatus);
        List<Therapist> therapistList = therapistRepository.findAll();
        Set<Therapist> therapistsNotAvailable = new HashSet<>();

        for (BookingSession bookingSession : bookingSessionList) {
            LocalDateTime existingStartTime = bookingSession.getBookingTime();
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

    public List<TherapistResponse> getTherapistAvailable(GetScheduleRequest request) {

        LocalDateTime time = request.getTime();
        LocalDateTime endTime = time.plusMinutes(59);
        endTime = endTime.plusSeconds(59);

        LocalDateTime startOfDay = time.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELED);
        List<BookingSession> bookingSessionList = bookingSessionRepository.findAllByBookingTimeBetweenAndStatusNotIn(startOfDay, endOfDay, excludeStatus);
        List<Therapist> therapistList = therapistRepository.findAll();
        Set<Therapist> therapistsNotAvailable = new HashSet<>();

        for (BookingSession bookingSession : bookingSessionList) {
            LocalDateTime existingStartTime = bookingSession.getBookingTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(bookingSession.getBooking().getService().getDuration());


            if (!(endTime.isBefore(existingStartTime) || time.isAfter(existingEndTime))) {
                therapistsNotAvailable.add(bookingSession.getTherapist());
            }
        }

        therapistList.removeAll(therapistsNotAvailable);

        if (therapistList.isEmpty()) {
            return List.of();
        }
        return therapistList.stream().map(therapistMapper::toTheRapistResponse).toList();
    }
}
