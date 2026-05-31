package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum DiscountType {
    PERCENTAGE((byte) 0),
    FIXED_AMOUNT((byte) 1);

    private final byte value;

    DiscountType(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static DiscountType fromValue(byte value) {
        for (DiscountType type : DiscountType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown discount type: " + value);
    }

    @Converter(autoApply = true)
    public static class DiscountTypeConverter implements AttributeConverter<DiscountType, Byte> {
        @Override
        public Byte convertToDatabaseColumn(DiscountType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public DiscountType convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
