package com.SWP.SkinCareService.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class VNPayConfig {
    public static final String VERSION = "2.1.0";
    public static final String COMMAND = "pay";
    public static final String CURR_CODE = "VND";
    public static final String COUNTRY_CODE = "VN";
    public static final String LOCALE = "vn";
    
    @Value("${vnpay.tmnCode:G6UJ6GM0}")
    private String tmnCode;
    
    @Value("${vnpay.hashSecret:KNWNX1BX0Z31T3MIX7E3KROK063KWANW}")
    private String hashSecret;
    
    @Value("${vnpay.payUrl:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String payUrl;


    @Value("${vnpay.returnUrl:http://localhost:8080/swp/payment/vnpay/status}")
    private String returnUrl;
    
    @Value("${vnpay.ipnUrl:http://localhost:8080/swp/payment/vnpay/ipn}")
    private String ipnUrl;
} 