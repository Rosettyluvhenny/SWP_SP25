package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.config.VNPayConfig;
import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.request.VNPAY.VNPayPaymentRequestDTO;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.BookingRepository;
import com.SWP.SkinCareService.utils.VNPayHashUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final BookingRepository bookingRepository;
    private final RoomService roomService;
    private final NotificationService notificationService;
    private final ReportService reportService;


    public String createPaymentUrl(@NonNull VNPayPaymentRequestDTO requestDTO, @NonNull String ipAddress) {
        validateCreatePaymentRequest(requestDTO, ipAddress);

        try {
            Map<String, String> vnp_Params = buildPaymentParams(requestDTO, ipAddress);
            String queryUrl = VNPayHashUtils.createQueryUrl(vnp_Params, vnPayConfig.getHashSecret());
            String fullUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;

            log.info("Created payment URL for TxnRef: {}", vnp_Params.get("vnp_TxnRef"));
            return fullUrl;
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating payment URL: {}", e.getMessage());
            throw new AppException(ErrorCode.VNPAY_PAYMENT_ERROR);
        }
    }

    public String processPaymentResponseUpdate(@NonNull Map<String, String> response) {
        Assert.notEmpty(response, "Payment response cannot be empty");

        try {
            if (response.isEmpty()) {
                throw new AppException(ErrorCode.VNPAY_MISSING_PARAMS);
            }

            validatePaymentResponse(response);
            return buildPaymentResultUpdate(response);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.VNPAY_PAYMENT_ERROR);
        }
    }


    public Map<String, String> processIPNResponse(@NonNull Map<String, String> response) {
        Assert.notEmpty(response, "IPN response cannot be empty");

        try {
            if (response.isEmpty()) {
                return createIPNResponse("99", "Invalid Request");
            }

            validatePaymentResponse(response);
            return processIPNResult(response);
        } catch (AppException e) {
            log.error("Error processing IPN response: {}", e.getMessage());
            return createIPNResponse("99", e.getMessage());
        } catch (Exception e) {
            log.error("Error processing IPN response: {}", e.getMessage());
            return createIPNResponse("99", "Unknown error");
        }
    }

    private void validateCreatePaymentRequest(VNPayPaymentRequestDTO requestDTO, String ipAddress) {
        Assert.notNull(requestDTO, "Payment request cannot be null");
        Assert.hasText(ipAddress, "IP address cannot be empty");

        if (!StringUtils.hasText(ipAddress)) {
            throw new AppException(ErrorCode.VNPAY_INVALID_IP_ADDRESS);
        }

        if (requestDTO.getBookingId() == null) {
            throw new AppException(ErrorCode.VNPAY_INVALID_ORDER_INFO);
        }
    }

    private Map<String, String> buildPaymentParams(VNPayPaymentRequestDTO requestDTO, String ipAddress) {
        // Lấy thông tin booking
        Booking booking = bookingRepository.findById(requestDTO.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));

        // Kiểm tra trạng thái thanh toán
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.VNPAY_PAYMENT_ERROR);
        }

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNPayConfig.VERSION);
        vnp_Params.put("vnp_Command", VNPayConfig.COMMAND);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(booking.getPrice().longValue() * 100));
        vnp_Params.put("vnp_CurrCode", VNPayConfig.CURR_CODE);

        String vnp_TxnRef = generateTxnRef();
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);

        String orderInfo = String.format("Payment for Booking #%s", requestDTO.getBookingId());
        vnp_Params.put("vnp_OrderInfo", orderInfo);

        vnp_Params.put("vnp_OrderType", "billpayment");
        vnp_Params.put("vnp_Locale", requestDTO.getLanguage() != null ? requestDTO.getLanguage() : VNPayConfig.LOCALE);
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", ipAddress);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        if (requestDTO.getBankCode() != null && !requestDTO.getBankCode().isEmpty()) {
            vnp_Params.put("vnp_BankCode", requestDTO.getBankCode());
        }

        return vnp_Params;
    }

    private void validatePaymentResponse(@NonNull Map<String, String> response) {
        if (!response.containsKey("vnp_SecureHash")) {
            log.warn("Missing secure hash in response");
            throw new AppException(ErrorCode.VNPAY_INVALID_CHECKSUM);
        }

        String vnp_SecureHash = response.get("vnp_SecureHash");
        if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) {
            log.warn("Empty secure hash in response");
            throw new AppException(ErrorCode.VNPAY_INVALID_CHECKSUM);
        }

        // Create a new map to avoid modifying the input
        Map<String, String> fields = new HashMap<>(response);
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String checkSum = VNPayHashUtils.hashAllFields(fields, vnPayConfig.getHashSecret());
        if (!checkSum.equals(vnp_SecureHash)) {
            log.warn("Invalid secure hash. Expected: {}, Got: {}", checkSum, vnp_SecureHash);
            throw new AppException(ErrorCode.VNPAY_INVALID_CHECKSUM);
        }
    }

    private String buildPaymentResultUpdate(Map<String, String> response) {
        String responseCode = response.getOrDefault("vnp_ResponseCode", "99");
        String transactionStatus = response.getOrDefault("vnp_TransactionStatus", "99");
        String transactionNo = response.get("vnp_TransactionNo");
        String transactionRef = response.get("vnp_TxnRef");

        if (!response.containsKey("vnp_Amount")) {
            throw new AppException(ErrorCode.VNPAY_MISSING_PARAMS);
        }

        long amount = Long.parseLong(response.get("vnp_Amount")) / 100;
        boolean isSuccess = "00".equals(responseCode) && "00".equals(transactionStatus);

        String url = "";
        String text = "";

        if (isSuccess) {
            // Cập nhật trạng thái đơn hàng khi thanh toán thành công
            try {
                // Lấy booking ID từ orderInfo
                String orderInfo = response.get("vnp_OrderInfo");
                int bookingId = extractBookingId(orderInfo);

                // Cập nhật trạng thái booking
                Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));

                booking.setPaymentStatus(PaymentStatus.PAID);
                booking.setStatus(BookingStatus.ON_GOING);

                // Cập nhật trạng thái các session
                List<BookingSession> sessions = booking.getBookingSessions();
                if (sessions != null && !sessions.isEmpty()) {
                    for (BookingSession session : sessions) {
                        if (session.getStatus() == BookingSessionStatus.PENDING) {
                            session.setStatus(BookingSessionStatus.WAITING);
                        }
                    }
                }
                //URL khi payment thành công
                url = "http://localhost:3000/BookingDetail/"+bookingId;
                //Notification
                text = "Gói dịch vụ "+booking.getService().getName()+" của bạn đã được đặt hoàn tất";
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .url("http://localhost:3000/bookingDetail/"+booking.getId())
                        .text(text)
                        .userId(booking.getUser().getId())
                        .isRead(false)
                        .build();
                notificationService.create(notificationRequest);
                //Remove payment url
                booking.setUrl(null);
                bookingRepository.save(booking);
                reportService.updateRevenue(booking.getPrice());
            } catch (Exception e) {
            }
        } else {
            try {
                String orderInfo = response.get("vnp_OrderInfo");
                int bookingId = extractBookingId(orderInfo);

                // Cập nhật trạng thái booking khi thanh toán thất bại
                Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));

                booking.setPaymentStatus(PaymentStatus.CANCELLED);
                booking.setStatus(BookingStatus.IS_CANCELED);
                List<BookingSession> sessionList = booking.getBookingSessions();
                if (sessionList != null && !sessionList.isEmpty()) {
                    for (BookingSession session : sessionList) {
                        session.setStatus(BookingSessionStatus.IS_CANCELED);
                    }
                }
                booking.setSessionRemain(0);
                ///URL khi payment thất bại
                url = "http://localhost:3000/BookingDetail/"+bookingId;
                //Notification
                text = "Thanh toán cho dịch vụ "+booking.getService().getName()+" thất bại";
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .url("http://localhost:3000/bookingDetail/"+booking.getId())
                        .text(text)
                        .userId(booking.getUser().getId())
                        .isRead(false)
                        .build();
                notificationService.create(notificationRequest);
                //Remove payment url
                booking.setUrl(null);
                bookingRepository.save(booking);
            } catch (Exception e) {
            }
        }

        return url;
    }

    private int extractBookingId(String orderInfo) {
        try {
            // Giả sử orderInfo có format: "Payment for Booking #123"
            String[] parts = orderInfo.split("#");
            return Integer.parseInt(parts[1].trim());
        } catch (Exception e) {
            log.error("Error extracting booking ID from orderInfo: {}", orderInfo);
            throw new AppException(ErrorCode.VNPAY_INVALID_ORDER_INFO);
        }
    }

    private Map<String, String> processIPNResult(Map<String, String> response) {
        String responseCode = response.get("vnp_ResponseCode");
        String transactionStatus = response.get("vnp_TransactionStatus");
        String transactionRef = response.get("vnp_TxnRef");

        if (!response.containsKey("vnp_Amount")) {
            return createIPNResponse("99", "Missing Amount");
        }

        long amount = Long.parseLong(response.get("vnp_Amount")) / 100;

        log.info("IPN Notification - TxnRef: {}, Amount: {}, Status: {}",
                transactionRef, amount, transactionStatus);

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            // TODO: Cập nhật trạng thái đơn hàng
            // orderService.updateOrderStatus(transactionRef, "PAID");
            return createIPNResponse("00", "Confirm Success");
        }

        log.warn("IPN notification failed - ResponseCode: {}, TransactionStatus: {}",
                responseCode, transactionStatus);
        return createIPNResponse("99", "Transaction Failed");
    }

    private String generateTxnRef() {
        return String.format("%s%d", vnPayConfig.getTmnCode(), System.currentTimeMillis());
    }

    private Map<String, String> createIPNResponse(@NonNull String rspCode, @NonNull String message) {
        Assert.hasText(rspCode, "Response code cannot be empty");
        Assert.hasText(message, "Message cannot be empty");

        return Map.of(
                "RspCode", rspCode,
                "Message", message
        );
    }

    private String getResponseMessage(String responseCode) {
        return switch (responseCode) {
            case "00" -> "Giao dịch thành công";
            case "07" -> "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)";
            case "09" -> "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng";
            case "10" -> "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11" -> "Giao dịch không thành công do: Đã hết hạn chờ thanh toán";
            case "12" -> "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa";
            case "13" -> "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)";
            case "24" -> "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            case "51" -> "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch";
            case "65" -> "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày";
            case "75" -> "Ngân hàng thanh toán đang bảo trì";
            case "79" -> "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định";
            case "99" -> "Các lỗi khác";
            default -> "Giao dịch thất bại";
        };
    }
}