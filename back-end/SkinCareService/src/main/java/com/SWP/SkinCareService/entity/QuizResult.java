package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "quiz_result")
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int resultId;

    private String resultText;
    private int rangePoint;

    @OneToMany(mappedBy = "quizResult",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<User> users;

    public QuizResult() {
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public int getResultId() {
        return resultId;
    }

    public void setResultId(int resultId) {
        this.resultId = resultId;
    }

    public String getResultText() {
        return resultText;
    }

    public void setResultText(String resultText) {
        this.resultText = resultText;
    }

    public int getRangePoint() {
        return rangePoint;
    }

    public void setRangePoint(int range) {
        this.rangePoint = range;
    }
}
