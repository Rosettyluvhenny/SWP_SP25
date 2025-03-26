package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    Report findByDate(LocalDate date);

    List<Report> findByDateBetween(LocalDate start, LocalDate end);
}
