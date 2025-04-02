package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Feedback.FeedbackRequest;
import com.SWP.SkinCareService.dto.response.Feedback.FeedbackResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.FeedbackMapper;
import com.SWP.SkinCareService.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {
    FeedbackRepository feedbackRepository;
    FeedbackMapper feedbackMapper;
    ServicesRepository servicesRepository;
    TherapistRepository therapistRepository;
    UserRepository userRepository;
    BookingSessionRepository bookingSessionRepository;
    SupabaseService supabaseService;

    @Transactional
    public FeedbackResponse createFeedback(FeedbackRequest feedbackRequest) {

        //Get user
        BookingSession session = getSessionById(feedbackRequest.getBookingSessionId());
        if (session.getStatus() != BookingSessionStatus.COMPLETED || session.isRated())
            throw new AppException(ErrorCode.CURRENT_SESSION_NOT_COMPLETED);
        User user = session.getBooking().getUser();
        //Get service
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User rqUser = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(!user.getId().equals(rqUser.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);
        Services services = session.getBooking().getService();
        //Get session
        Therapist therapist = session.getTherapist();

        Feedback feedback = feedbackMapper.toFeedBack(feedbackRequest);
        //Get therapist

        feedback.setService(services);
        feedback.setUser(user);
        feedback.setBookingSession(session);
        feedback.setTherapist(therapist);
        feedback.setRating(feedbackRequest.getRating());
        feedback.setFeedbackText(feedback.getFeedbackText());
        feedbackRepository.save(feedback);
        session.setRated(true);
        bookingSessionRepository.save(session);
        float serviceRating = 0;

        Set<Feedback> feedbackListService = services.getFeedbacks();
        if (feedbackListService.isEmpty()) {
            serviceRating = (float) feedback.getRating();
        } else {
            for (Feedback feedbackInList : feedbackListService) {
                if (feedbackInList.getRating() != null) {
                    serviceRating += (float) feedbackInList.getRating();
                }
            }
            serviceRating = serviceRating / feedbackListService.size();
        }
        services.setRating(serviceRating);
        servicesRepository.save(services);
        //Calculate rating for Therapist
        float therapistRating = 0;
        Set<Feedback> feedbackListTherapist = therapist.getFeedbacks();
        if (feedbackListTherapist.isEmpty()) {
            therapistRating = (float) feedback.getRating();
        } else {
            for (Feedback feedbackInList : feedbackListTherapist) {
                if (feedbackInList.getRating() != null) {
                    therapistRating += (float) feedbackInList.getRating();
                }
            }
            therapistRating = therapistRating / feedbackListTherapist.size();
        }
        therapist.setRating(therapistRating);
        therapistRepository.save(therapist);
        return feedbackMapper.toFeedbackResponse(feedback);

    }
    public List<FeedbackResponse> getByServiceId(int serviceId){
       return feedbackRepository.findAllByService_Id(serviceId).stream().map(feedbackMapper::toFeedbackResponse).toList();
    }
    public List<FeedbackResponse> getByTherapistId(String theraId){
        return feedbackRepository.findAllByTherapist_Id(theraId).stream().map(feedbackMapper::toFeedbackResponse).toList();
    }

    public Page<FeedbackResponse> getAll(String therapistId, Integer serviceId, Integer rating, Pageable pageable) {
        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if(therapistId != null){
                Therapist therapist = getTherapistById(therapistId);
                predicates.add(cb.equal(root.get("therapist").get("id"),therapistId));
            }
            if(serviceId !=null){
                Services service = getServiceById(serviceId);
                predicates.add(cb.equal(root.get("service").get("id"),serviceId));
            }
            if(rating != null){
                predicates.add(cb.equal(root.get("rating"),rating));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return feedbackRepository.findAll(spec, pageable).map(feedbackMapper::toFeedbackResponse);
    }

    public FeedbackResponse getFeedbackById(int id) {
        Feedback feedback = getById(id);
        return feedbackMapper.toFeedbackResponse(feedback);
    }

    @PreAuthorize("hasRole('USER') && authentication.name == returnObject.user")
    public List<FeedbackResponse> getFeedbackByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(()-> new AppException(ErrorCode.UNAUTHENTICATED));
        return feedbackRepository.findAllByUser(user).stream().map(feedbackMapper::toFeedbackResponse).toList();
    }

    @Transactional
    public void deleteFeedbackById(int id) {
        Feedback feedback = getById(id);
        //Get service
        Services services = feedback.getService();


        //Calculate rating for Service
        float serviceRating = 0;
        Set<Feedback> feedbackListByBeforeService = services.getFeedbacks();
        Set<Feedback> feedbackListAfterService = new HashSet<>(feedbackListByBeforeService);
        feedbackListAfterService.remove(feedback);
        if (!feedbackListAfterService.isEmpty()) {
            for (Feedback feedbackInList : feedbackListAfterService) {
                serviceRating += feedbackInList.getRating();
            }
            serviceRating = serviceRating / feedbackListAfterService.size();
        }
        services.setRating(serviceRating);
        services.getFeedbacks().remove(feedback);

        //Get therapist
        Therapist therapist = feedback.getTherapist();
        //Calculate rating for Therapist
        float therapistRating = 0;
        Set<Feedback> feedbackListBeforeTherapist = therapist.getFeedbacks();
        Set<Feedback> feedbackListAfterTherapist = new HashSet<>(feedbackListBeforeTherapist);
        feedbackListAfterTherapist.remove(feedback);
        if (!feedbackListAfterTherapist.isEmpty()) {
            for (Feedback feedbackInList : feedbackListAfterTherapist) {
                therapistRating += feedbackInList.getRating();
            }
            therapistRating = therapistRating / feedbackListAfterTherapist.size();

        }
        therapist.setRating(therapistRating);
        therapist.getFeedbacks().remove(feedback);
        servicesRepository.save(services);
        therapistRepository.save(therapist);
        feedbackRepository.delete(feedback);
    }

    private Feedback getById(int id) {
        return feedbackRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
    }

    private List<Feedback> getAllFeedbackByServices(Services services) {
        return feedbackRepository.findAllByService_Id(services.getId());
    }

    private List<Feedback> getAllFeedbackByTherapist(Therapist therapist) {
        return feedbackRepository.findAllByTherapist_Id(therapist.getId());
    }

    private Services getServiceById(int id) {
        return servicesRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    private Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }

    private User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private BookingSession getSessionById(int id) {
        return bookingSessionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SESSION_NOT_EXISTED));
    }
}
