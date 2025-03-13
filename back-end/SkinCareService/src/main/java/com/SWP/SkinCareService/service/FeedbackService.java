package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Feedback.FeedbackRequest;
import com.SWP.SkinCareService.dto.request.Feedback.FeedbackUpdateRequest;
import com.SWP.SkinCareService.dto.response.Feedback.FeedbackResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.FeedbackMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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

    @Transactional
    public FeedbackResponse createFeedback(FeedbackRequest feedbackRequest) {
        Feedback feedback = feedbackMapper.toFeedBack(feedbackRequest);
        //Get user
        User user = getUserById(feedbackRequest.getUserId());
        //Get service
        Services services = getServiceById(feedbackRequest.getServiceId());
        //Get session
        BookingSession session = getSessionById(feedbackRequest.getBookingSessionId());
        //Get therapist
        Therapist therapist = getTherapistById(feedbackRequest.getTherapistId());
        feedback.setService(services);
        feedback.setUser(user);
        feedback.setBookingSession(session);
        feedback.setTherapist(therapist);
        feedback.setRating(0);
        feedbackRepository.save(feedback);
        return feedbackMapper.toFeedbackResponse(feedback);
    }
    @Transactional
    public FeedbackResponse updateFeedback(int id, FeedbackUpdateRequest request) {
        Feedback feedback = getById(id);
        feedback.setFeedbackText(request.getFeedbackText());
        feedback.setRating(request.getRating());
        feedback.setRated(true);
        feedbackRepository.save(feedback);


        //Get service
        Services service = feedback.getService();
        //Calculate rating for Service
        float serviceRating = 0;

        Set<Feedback> feedbackListService = service.getFeedbacks();
        if (feedbackListService.isEmpty()) {
            serviceRating = (float) feedback.getRating();
            service.setRating(serviceRating);
            servicesRepository.save(service);
        } else {
            for (Feedback feedbackInList : feedbackListService) {
                if (feedbackInList.getRating() != null) {
                    serviceRating += (float) feedbackInList.getRating();
                }
            }
            serviceRating = serviceRating / feedbackListService.size();
            service.setRating(serviceRating);
            servicesRepository.save(service);
        }


        //Get therapist
        Therapist therapist = feedback.getTherapist();
        //Calculate rating for Therapist
        float therapistRating = 0;
        Set<Feedback> feedbackListTherapist = therapist.getFeedbacks();
        if (feedbackListTherapist.isEmpty()) {
            therapistRating = (float) feedback.getRating();
            therapist.setRating(therapistRating);
            therapistRepository.save(therapist);
        } else {
            for (Feedback feedbackInList : feedbackListTherapist) {
                if (feedbackInList.getRating() != null) {
                    therapistRating += (float) feedbackInList.getRating();
                }
            }
            therapistRating = therapistRating / feedbackListTherapist.size();
            therapist.setRating(therapistRating);
            therapistRepository.save(therapist);
        }

        return feedbackMapper.toFeedbackResponse(feedback);
    }

    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAll().stream().map(feedbackMapper::toFeedbackResponse).toList();
    }

    public FeedbackResponse getFeedbackById(int id) {
        return feedbackMapper.toFeedbackResponse(feedbackRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND)));
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
        if (feedbackListAfterService.isEmpty()) {
            services.setRating(serviceRating);
            services.getFeedbacks().remove(feedback);
        } else {
            for (Feedback feedbackInList : feedbackListAfterService) {
                serviceRating += feedbackInList.getRating();
            }
            serviceRating = serviceRating / feedbackListAfterService.size();
            services.setRating(serviceRating);
            services.getFeedbacks().remove(feedback);
        }

        //Get therapist
        Therapist therapist = feedback.getTherapist();
        //Calculate rating for Therapist
        float therapistRating = 0;
        Set<Feedback> feedbackListBeforeTherapist = therapist.getFeedbacks();
        Set<Feedback> feedbackListAfterTherapist = new HashSet<>(feedbackListBeforeTherapist);
        feedbackListAfterTherapist.remove(feedback);
        if (feedbackListAfterTherapist.isEmpty()) {
            therapist.setRating(therapistRating);
            therapist.getFeedbacks().remove(feedback);
        } else {
            for (Feedback feedbackInList : feedbackListAfterTherapist) {
                therapistRating += feedbackInList.getRating();
            }
            therapistRating = therapistRating / feedbackListAfterTherapist.size();
            therapist.setRating(therapistRating);
            therapist.getFeedbacks().remove(feedback);

        }
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
