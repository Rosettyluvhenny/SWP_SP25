package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Report.ReportRequest;
import com.SWP.SkinCareService.dto.response.Report.ReportResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.ReceiptDTO;
import com.SWP.SkinCareService.entity.Receipt;
import com.SWP.SkinCareService.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReportMapper {
    Report toReport(ReportRequest request);

    void updateReport(@MappingTarget Report report, ReportRequest request);

    @Mapping(target = "receipts", expression = "java(toReceiptDTOList(report.getReceipts()))")
    ReportResponse toReportResponse(Report report);

    @Mapping(target = "paymentMethod", source = "payment.paymentName")
    @Mapping(target = "staffName", source = "staff.fullName")
    @Mapping(target = "customerName", source = "customerName")
    ReceiptDTO toReceiptDTO(Receipt receipt);
    List<ReceiptDTO> toReceiptDTOList(List<Receipt> receiptList);

}
