package com.wms.entity;

import com.wms.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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
    @Column(name = "Id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "AssignmentId", nullable = false)
    private Assignment assignment;

    @Column(name = "QuestionType", nullable = false)
    private QuestionType questionType;

    @Column(name = "Content", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "Options", columnDefinition = "NVARCHAR(MAX)")
    private String options; // JSON string

    @Column(name = "CorrectAnswer", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String correctAnswer;

    @Column(name = "Points", nullable = false, precision = 5, scale = 2)
    private BigDecimal points = BigDecimal.valueOf(1.00);

    @Column(name = "OrderIndex", nullable = false)
    private int orderIndex = 0;
}
