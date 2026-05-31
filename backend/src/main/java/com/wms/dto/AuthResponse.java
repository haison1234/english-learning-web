package com.wms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;
}
