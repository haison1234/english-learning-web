package com.wms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Mã xác thực không được để trống")
    private String token;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;
}
