package com.wms.repository;

import com.wms.entity.ExerciseAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseAttemptRepository extends JpaRepository<ExerciseAttempt, UUID> {
    List<ExerciseAttempt> findByEnrollmentIdAndLessonIdOrderByAttemptedAtDesc(UUID enrollmentId, UUID lessonId);
}
