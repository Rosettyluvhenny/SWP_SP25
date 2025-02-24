package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "serviceQuizResult")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceQuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @ManyToOne()
    @JoinColumn(name = "serviceId")
    @JsonBackReference
    private ServiceList service;

    @ManyToOne()
    @JoinColumn(name = "quizResultId")
    @JsonBackReference
    private QuizResult quizResult;

}
