package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.VNPayPaymentRequestDTO;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment/vnpay")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin("*")
public class VNPayController {
    
    private final VNPayService vnPayService;

    @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createPayment(
            @Valid @RequestBody VNPayPaymentRequestDTO requestDTO,
            HttpServletRequest request) {
        try {
            String ipAddress = getIpAddress(request);
            if (!StringUtils.hasText(ipAddress)) {
                throw new AppException(ErrorCode.VNPAY_INVALID_IP_ADDRESS);
            }

            String paymentUrl = vnPayService.createPaymentUrl(requestDTO, ipAddress);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Tạo URL thanh toán thành công",
                "paymentUrl", paymentUrl
            ));
        } catch (AppException e) {
            log.error("Error creating payment: {}", e.getMessage());
            return ResponseEntity.status(e.getErrorCode().getHttpStatusCode())
                    .body(Map.of(
                        "status", "error",
                        "code", e.getErrorCode().getCode(),
                        "message", e.getMessage()
                    ));
        }
    }

    @GetMapping("/return")
    public ResponseEntity<Map<String, Object>> vnpayReturn(@RequestParam Map<String, String> queryParams) {
        log.info("Received return from VNPAY: {}", queryParams);
        
        try {
            if (queryParams.isEmpty()) {
                throw new AppException(ErrorCode.VNPAY_MISSING_PARAMS);
            }
            
            Map<String, Object> result = vnPayService.processPaymentResponse(queryParams);
            return ResponseEntity.ok(Map.of(
                "status", result.get("isSuccess").equals(true) ? "success" : "error",
                "message", result.get("message"),
                "data", result
            ));
        } catch (AppException e) {
            log.error("Error processing payment return: {}", e.getMessage());
            return ResponseEntity.status(e.getErrorCode().getHttpStatusCode())
                    .body(Map.of(
                        "status", "error",
                        "code", e.getErrorCode().getCode(),
                        "message", e.getMessage()
                    ));
        }
    }

    @PostMapping("/ipn")
    public ResponseEntity<Map<String, String>> vnpayIPN(@RequestParam Map<String, String> queryParams) {
        log.info("Received IPN from VNPAY: {}", queryParams);
        
        try {
            if (queryParams.isEmpty()) {
                throw new AppException(ErrorCode.VNPAY_MISSING_PARAMS);
            }
            
            Map<String, String> response = vnPayService.processIPNResponse(queryParams);
            return ResponseEntity.ok(response);
        } catch (AppException e) {
            log.error("Error processing IPN: {}", e.getMessage());
            return ResponseEntity.status(e.getErrorCode().getHttpStatusCode())
                    .body(Map.of(
                        "RspCode", "99",
                        "Message", e.getMessage()
                    ));
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (!StringUtils.hasText(ipAddress)) {
            ipAddress = request.getHeader("X-Real-IP");
        }
        if (!StringUtils.hasText(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        
        // Nếu có nhiều IP (qua proxy), lấy IP đầu tiên
        if (StringUtils.hasText(ipAddress) && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        
        return ipAddress;
    }
} 