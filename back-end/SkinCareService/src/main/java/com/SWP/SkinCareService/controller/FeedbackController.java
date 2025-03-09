package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Feedback.FeedbackRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Feedback.FeedbackResponse;
import com.SWP.SkinCareService.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PutMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateFeedback(@PathVariable int feedbackId, @RequestBody FeedbackRequest feedbackRequest) {
        var result = feedbackService.updateFeedback(feedbackId, feedbackRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<FeedbackResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse> deleteFeedback(@PathVariable int feedbackId) {
        feedbackService.deleteFeedbackById(feedbackId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Feedback deleted").build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getAllFeedbacks() {
        var result = feedbackService.getAllFeedback();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<FeedbackResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedback(@PathVariable int feedbackId) {
        var result = feedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<FeedbackResponse>builder().result(result).build()
        );
    }
}
