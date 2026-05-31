package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum LessonContentType {
    VIDEO((byte) 0),
    AUDIO((byte) 1),
    TEXT((byte) 2),
    PDF((byte) 3);

    private final byte value;

    LessonContentType(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static LessonContentType fromValue(byte value) {
        for (LessonContentType type : LessonContentType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown content type: " + value);
    }

    @Converter(autoApply = true)
    public static class LessonContentTypeConverter implements AttributeConverter<LessonContentType, Byte> {
        @Override
        public Byte convertToDatabaseColumn(LessonContentType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public LessonContentType convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
