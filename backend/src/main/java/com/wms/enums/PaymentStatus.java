package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum PaymentStatus {
    PENDING((byte) 0),
    SUCCESS((byte) 1),
    FAILED((byte) 2),
    REFUNDED((byte) 3);

    private final byte value;

    PaymentStatus(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static PaymentStatus fromValue(byte value) {
        for (PaymentStatus status : PaymentStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown payment status: " + value);
    }

    @Converter(autoApply = true)
    public static class PaymentStatusConverter implements AttributeConverter<PaymentStatus, Byte> {
        @Override
        public Byte convertToDatabaseColumn(PaymentStatus attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public PaymentStatus convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
