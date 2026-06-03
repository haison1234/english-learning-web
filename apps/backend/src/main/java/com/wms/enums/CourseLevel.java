package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum CourseLevel {
    BEGINNER((byte) 0),
    INTERMEDIATE((byte) 1),
    ADVANCED((byte) 2);

    private final byte value;

    CourseLevel(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static CourseLevel fromValue(byte value) {
        for (CourseLevel level : CourseLevel.values()) {
            if (level.value == value) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown course level: " + value);
    }

    @Converter(autoApply = true)
    public static class CourseLevelConverter implements AttributeConverter<CourseLevel, Byte> {
        @Override
        public Byte convertToDatabaseColumn(CourseLevel attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public CourseLevel convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
