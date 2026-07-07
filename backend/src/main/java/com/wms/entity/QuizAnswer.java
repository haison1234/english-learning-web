package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "QuizAnswers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AttemptId", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QuestionId", nullable = false)
    private Question question;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String studentAnswer;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String correctAnswer;

    private Boolean isCorrect;

    private Integer score;
}