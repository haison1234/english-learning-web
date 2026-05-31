package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum PaymentMethod {
    VNPAY((byte) 0),
    MOMO((byte) 1),
    BANK_CARD((byte) 2),
    FREE((byte) 3);

    private final byte value;

    PaymentMethod(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static PaymentMethod fromValue(byte value) {
        for (PaymentMethod method : PaymentMethod.values()) {
            if (method.value == value) {
                return method;
            }
        }
        throw new IllegalArgumentException("Unknown payment method: " + value);
    }

    @Converter(autoApply = true)
    public static class PaymentMethodConverter implements AttributeConverter<PaymentMethod, Byte> {
        @Override
        public Byte convertToDatabaseColumn(PaymentMethod attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public PaymentMethod convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
