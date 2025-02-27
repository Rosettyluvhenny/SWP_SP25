package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.TherapistResponse;
import com.SWP.SkinCareService.service.TherapistService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/therapist")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
class TherapistController {
    TherapistService therapistService;

    @PostMapping
    ResponseEntity<ApiResponse<TherapistResponse>> create(@RequestBody @Valid TherapistRequest request){
        var result = therapistService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<TherapistResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<TherapistResponse>>> getAll(){
        var result = therapistService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<TherapistResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{therapistId}")
    ResponseEntity<ApiResponse<TherapistResponse>> getById(@PathVariable String therapistId){
        var result = therapistService.findById(therapistId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<TherapistResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<TherapistResponse>> update(@PathVariable String id, @RequestBody @Valid TherapistUpdateRequest request){
        var result = therapistService.update(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<TherapistResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{id}/disable")
    ResponseEntity<ApiResponse> disable (@PathVariable String id){
        therapistService.disable(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Disable successfully")
                        .build()
        );
    }
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse> delete (@PathVariable String id){
        therapistService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Delete successfully")
                        .build()
        );
    }
}
