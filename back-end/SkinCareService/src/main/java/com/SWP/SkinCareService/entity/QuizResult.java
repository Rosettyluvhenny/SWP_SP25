package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_result")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String resultText;
    private int rangePoint;

    @OneToMany(mappedBy = "quizResult",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<User> users;

    //Many To Many
    @ManyToMany(mappedBy = "quizResults",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Services> services =  new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "quizId")
    @JsonBackReference
    private Quiz quiz;
}
