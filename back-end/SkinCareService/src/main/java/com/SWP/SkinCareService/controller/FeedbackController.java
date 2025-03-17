package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Feedback.FeedbackRequest;
import com.SWP.SkinCareService.dto.request.Feedback.FeedbackUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Feedback.FeedbackResponse;
import com.SWP.SkinCareService.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping()
    public ResponseEntity<ApiResponse<FeedbackResponse>> createFeedback(@RequestBody FeedbackRequest feedbackRequest) {
        var result = feedbackService.createFeedback(feedbackRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<FeedbackResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getAllFeedbacks() {
        var result = feedbackService.getAllFeedback();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<FeedbackResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{userId}/all")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getAllFeedbacksByUserId(@PathVariable String userId) {
        var result = feedbackService.getFeedbackByUser(userId);
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

    @PutMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateFeedback(@PathVariable int feedbackId, @RequestBody FeedbackUpdateRequest feedbackRequest) {
        var result = feedbackService.updateFeedback(feedbackId, feedbackRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<FeedbackResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{feedbackId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteFeedback(@PathVariable int feedbackId) {
        feedbackService.deleteFeedbackById(feedbackId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Feedback deleted").build()
        );
    }


}
