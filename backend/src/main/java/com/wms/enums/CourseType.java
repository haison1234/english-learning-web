package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum CourseType {
    FREE((byte) 0),
    PAID((byte) 1);

    private final byte value;

    CourseType(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static CourseType fromValue(byte value) {
        for (CourseType type : CourseType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown course type: " + value);
    }

    @Converter(autoApply = true)
    public static class CourseTypeConverter implements AttributeConverter<CourseType, Byte> {
        @Override
        public Byte convertToDatabaseColumn(CourseType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public CourseType convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
