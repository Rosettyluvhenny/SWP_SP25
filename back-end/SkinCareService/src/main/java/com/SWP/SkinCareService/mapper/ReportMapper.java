package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Report.ReportRequest;
import com.SWP.SkinCareService.dto.response.Report.ReportResponse;
import com.SWP.SkinCareService.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReportMapper {
    Report toReport(ReportRequest request);

    void updateReport(@MappingTarget Report report, ReportRequest request);

    ReportResponse toReportResponse(Report report);
}
