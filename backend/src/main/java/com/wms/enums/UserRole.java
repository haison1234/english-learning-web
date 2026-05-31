package com.wms.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum UserRole {
    GUEST((byte) 0),
    STUDENT((byte) 1),
    ADMIN((byte) 2);

    private final byte value;

    UserRole(byte value) {
        this.value = value;
    }

    @JsonValue
    public byte getValue() {
        return value;
    }

    public static UserRole fromValue(byte value) {
        for (UserRole role : UserRole.values()) {
            if (role.value == value) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown role value: " + value);
    }

    @Converter(autoApply = true)
    public static class UserRoleConverter implements AttributeConverter<UserRole, Byte> {
        @Override
        public Byte convertToDatabaseColumn(UserRole attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public UserRole convertToEntityAttribute(Byte dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
