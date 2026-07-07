package com.wms.repository;

import com.wms.entity.NotificationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationCampaignRepository extends JpaRepository<NotificationCampaign, UUID> {
    List<NotificationCampaign> findAllByOrderBySentAtDesc(); // Admin xem lịch sử gửi mới nhất lên đầu
}