package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_result")
@Getter
@Setter
@ToString(exclude = {"users", "services", "quiz"})
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String resultText;
    private int minPoint;
    private int maxPoint;

    @OneToMany(mappedBy = "quizResult")
    @JsonManagedReference
    private List<User> users;

    @ManyToMany(mappedBy = "quizResults")
    @JsonBackReference
    private List<Services> services = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "quizId")
    @JsonBackReference
    private Quiz quiz;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuizResult that = (QuizResult) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return id;
    }
}
