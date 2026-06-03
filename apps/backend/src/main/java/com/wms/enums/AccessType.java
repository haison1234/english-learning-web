package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum AccessType {
    FREE((byte) 0),
    PAID((byte) 1);

    private final byte value;

    AccessType(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static AccessType fromValue(byte value) {
        for (AccessType type : AccessType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown access type: " + value);
    }

    @Converter(autoApply = true)
    public static class AccessTypeConverter implements AttributeConverter<AccessType, Byte> {
        @Override
        public Byte convertToDatabaseColumn(AccessType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public AccessType convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
