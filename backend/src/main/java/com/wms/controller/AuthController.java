package com.wms.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.wms.dto.AuthResponse;
import com.wms.dto.GoogleLoginRequest;
import com.wms.dto.UserDTO;
import com.wms.entity.User;
import com.wms.enums.UserRole;
import com.wms.enums.UserStatus;
import com.wms.repository.UserRepository;
import com.wms.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5174") // Allow frontend calls from dev port 5174
public class AuthController {

    private final GoogleAuthService googleAuthService;
    private final UserRepository userRepository;

    public AuthController(GoogleAuthService googleAuthService, UserRepository userRepository) {
        this.googleAuthService = googleAuthService;
        this.userRepository = userRepository;
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            System.out.println("==================================================");
            System.out.println("📥 RECEIVED GOOGLE LOGIN REQUEST WITH CODE!");
            System.out.println("==================================================");
            
            // 1. Verify Google Authorization Code and get the user payload
            GoogleIdToken.Payload googleUser = googleAuthService.verifyGoogleCode(request.getCode());

            String email = googleUser.getEmail();
            String fullName = (String) googleUser.get("name");
            String avatarUrl = (String) googleUser.get("picture");
            String googleSubId = googleUser.getSubject();

            // 2. Fetch or auto-register the User
            Optional<User> userOptional = userRepository.findByEmail(email);
            User user;

            if (userOptional.isPresent()) {
                user = userOptional.get();
                // Sync profiles with the latest Google metadata
                user.setFullName(fullName);
                user.setAvatarUrl(avatarUrl);
                user.setOAuthId(googleSubId);
                user.setOAuthProvider("google");
                userRepository.save(user);
            } else {
                // Register a new student with ACTIVE status
                user = User.builder()
                        .fullName(fullName)
                        .email(email)
                        .avatarUrl(avatarUrl)
                        .role(UserRole.STUDENT)
                        .status(UserStatus.ACTIVE)
                        .emailVerified(true)
                        .oAuthProvider("google")
                        .oAuthId(googleSubId)
                        .build();
                userRepository.save(user);
            }

            // 3. Map User model properties into your standard UserDTO
            UserDTO userDto = UserDTO.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .avatarUrl(user.getAvatarUrl())
                    .role(user.getRole())
                    .status(user.getStatus())
                    .emailVerified(user.isEmailVerified())
                    .oAuthProvider(user.getOAuthProvider())
                    .oAuthId(user.getOAuthId())
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();

            // 4. Generate local authentication tokens (placeholder tokens that React will store)
            String localAccessToken = "demo-access-token-for-" + user.getEmail();
            String localRefreshToken = "demo-refresh-token-for-" + user.getEmail();

            AuthResponse authResponse = AuthResponse.builder()
                    .accessToken(localAccessToken)
                    .refreshToken(localRefreshToken)
                    .user(userDto)
                    .build();

            System.out.println("🎉 GOOGLE LOGIN SUCCESSFUL FOR EMAIL: " + email);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("==================================================");
            System.err.println("❌ ERROR IN GOOGLE LOGIN PROCESS! ❌");
            System.err.println("Error Message: " + e.getMessage());
            System.err.println("==================================================");
            e.printStackTrace();
            throw new RuntimeException("Google auth failed: " + e.getMessage(), e);
        }
    }
}
