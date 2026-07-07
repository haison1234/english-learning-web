package com.wms.repository;

import com.wms.entity.Enrollment;
import com.wms.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    List<Enrollment> findByUserId(UUID userId);
    List<Enrollment> findByUserIdAndPaymentStatus(UUID userId, PaymentStatus paymentStatus);
    Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
    List<Enrollment> findByCourseId(UUID courseId);
}
