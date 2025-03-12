package com.SWP.SkinCareService.dto;

import lombok.Data;

@Data
public class VNPayPaymentRequestDTO {
    private String orderType;
    private Long amount;
    private String orderInfo;
    private String bankCode;
    private String language;
} 