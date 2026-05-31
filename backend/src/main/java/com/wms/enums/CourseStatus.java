package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum CourseStatus {
    DRAFT((byte) 0),
    PUBLISHED((byte) 1),
    ARCHIVED((byte) 2);

    private final byte value;

    CourseStatus(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static CourseStatus fromValue(byte value) {
        for (CourseStatus status : CourseStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown course status: " + value);
    }

    @Converter(autoApply = true)
    public static class CourseStatusConverter implements AttributeConverter<CourseStatus, Byte> {
        @Override
        public Byte convertToDatabaseColumn(CourseStatus attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public CourseStatus convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
