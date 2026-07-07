package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QuizId", nullable = false)
    private Quiz quiz;

    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String content;

    // 0 MCQ
    // 1 FillBlank
    // 2 Matching
    private Integer type;

    private Integer score;
}