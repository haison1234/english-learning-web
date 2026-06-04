package com.wms.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PaymentCreateRequest {
    private UUID courseId;
}
