package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum QuestionType {
    MULTIPLE_CHOICE((byte) 0),
    FILL_BLANK((byte) 1),
    MATCHING((byte) 2);

    private final byte value;

    QuestionType(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static QuestionType fromValue(byte value) {
        for (QuestionType type : QuestionType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown question type: " + value);
    }

    @Converter(autoApply = true)
    public static class QuestionTypeConverter implements AttributeConverter<QuestionType, Byte> {
        @Override
        public Byte convertToDatabaseColumn(QuestionType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public QuestionType convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
