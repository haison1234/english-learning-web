package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum UserStatus {
    INACTIVE((byte) 0),
    ACTIVE((byte) 1);

    private final byte value;

    UserStatus(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static UserStatus fromValue(byte value) {
        for (UserStatus status : UserStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status value: " + value);
    }

    @Converter(autoApply = true)
    public static class UserStatusConverter implements AttributeConverter<UserStatus, Byte> {
        @Override
        public Byte convertToDatabaseColumn(UserStatus attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public UserStatus convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
