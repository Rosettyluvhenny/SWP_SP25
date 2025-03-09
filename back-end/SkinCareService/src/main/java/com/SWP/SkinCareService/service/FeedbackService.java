package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Feedback.FeedbackRequest;
import com.SWP.SkinCareService.dto.response.Feedback.FeedbackResponse;
import com.SWP.SkinCareService.entity.Feedback;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.FeedbackMapper;
import com.SWP.SkinCareService.repository.FeedbackRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {
    FeedbackRepository feedbackRepository;
    FeedbackMapper feedbackMapper;
    ServicesRepository servicesRepository;
    TherapistRepository therapistRepository;


    public FeedbackResponse updateFeedback(int id, FeedbackRequest request) {
        Feedback feedback = getById(id);
        feedback.setFeedbackText(request.getFeedbackText());
        feedback.setRating(request.getRating());
        feedback.setRated(true);
        feedbackRepository.save(feedback);


        //Get service
        Services services = getServiceById(feedback.getServiceId());
        //Calculate rating for Service
        float serviceRating = 0;
        List<Feedback> feedbackListService = getAllFeedbackByServices(services);
        if (feedbackListService.isEmpty()) {
            serviceRating = feedback.getRating();
            services.setRating(serviceRating);
            servicesRepository.save(services);
        } else {
            for (Feedback feedbackInList : feedbackListService) {
                serviceRating += feedbackInList.getRating();
            }
            serviceRating = serviceRating / feedbackListService.size();
            services.setRating(serviceRating);
            servicesRepository.save(services);
        }


        //Get therapist
        Therapist therapist = getTherapistById(feedback.getTherapistId());
        //Calculate rating for Therapist
        float therapistRating = 0;
        List<Feedback> feedbackListTherapist = getAllFeedbackByTherapist(therapist);
        if (feedbackListTherapist.isEmpty()) {
            therapistRating = feedback.getRating();
            therapist.setRating(therapistRating);
            therapistRepository.save(therapist);
        } else {
            for (Feedback feedbackInList : feedbackListTherapist) {
                therapistRating += feedbackInList.getRating();
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

    public void deleteFeedbackById(int id) {
        Feedback feedback = getById(id);

        //Get service
        Services services = getServiceById(feedback.getServiceId());
        //Calculate rating for Service
        float serviceRating = 0;
        List<Feedback> feedbackListService = getAllFeedbackByServices(services);
        feedbackListService.remove(feedback);
        if (feedbackListService.isEmpty()) {
            serviceRating = feedback.getRating();
            services.setRating(serviceRating);
            servicesRepository.save(services);
        } else {
            for (Feedback feedbackInList : feedbackListService) {
                serviceRating += feedbackInList.getRating();
            }
            serviceRating = serviceRating / feedbackListService.size();
            services.setRating(serviceRating);
            servicesRepository.save(services);
        }

        //Get therapist
        Therapist therapist = getTherapistById(feedback.getTherapistId());
        //Calculate rating for Therapist
        float therapistRating = 0;
        List<Feedback> feedbackListTherapist = getAllFeedbackByTherapist(therapist);
        feedbackListTherapist.remove(feedback);
        if (feedbackListTherapist.isEmpty()) {
            therapistRating = feedback.getRating();
            therapist.setRating(therapistRating);
            therapistRepository.save(therapist);
        } else {
            for (Feedback feedbackInList : feedbackListTherapist) {
                therapistRating += feedbackInList.getRating();
            }
            therapistRating = therapistRating / feedbackListTherapist.size();
            therapist.setRating(therapistRating);
            therapistRepository.save(therapist);
        }


        feedbackRepository.delete(feedback);
    }

    private Feedback getById(int id) {
        return feedbackRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
    }

    private List<Feedback> getAllFeedbackByServices(Services services) {
        List<Feedback> list = feedbackRepository.findAll();
        List<Feedback> filteredList = new ArrayList<>();
        for (Feedback feedback : list) {
            if (feedback.getServiceId() == services.getId()) {
                filteredList.add(feedback);
            }
        }
        return filteredList;
    }

    private List<Feedback> getAllFeedbackByTherapist(Therapist therapist) {
        List<Feedback> list = feedbackRepository.findAll();
        List<Feedback> filteredList = new ArrayList<>();
        for (Feedback feedback : list) {
            if (feedback.getTherapistId().equals(therapist.getId())) {
                filteredList.add(feedback);
            }
        }
        return filteredList;
    }

    private Services getServiceById(int id) {
        return servicesRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    private Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }
}
