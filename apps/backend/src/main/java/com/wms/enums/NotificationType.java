package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum NotificationType {
    NEW_ASSIGNMENT((byte) 0),
    DEADLINE((byte) 1),
    ENROLL_SUCCESS((byte) 2),
    COMMENT_REPLY((byte) 3),
    COURSE_COMPLETE((byte) 4),
    ADMIN_BROADCAST((byte) 5);

    private final byte value;

    NotificationType(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static NotificationType fromValue(byte value) {
        for (NotificationType type : NotificationType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown notification type: " + value);
    }

    @Converter(autoApply = true)
    public static class NotificationTypeConverter implements AttributeConverter<NotificationType, Byte> {
        @Override
        public Byte convertToDatabaseColumn(NotificationType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public NotificationType convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
