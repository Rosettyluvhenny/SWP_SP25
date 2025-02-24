package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "quiz")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "service_category_id")
    @JsonBackReference
    private ServiceCategory serviceCategory;

    private String quizName;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;


}
