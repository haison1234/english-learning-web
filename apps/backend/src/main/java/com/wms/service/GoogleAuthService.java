package com.wms.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class GoogleAuthService {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GoogleIdToken.Payload verifyGoogleCode(String code) {
        try {
            String tokenUrl = "https://oauth2.googleapis.com/token";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", "postmessage"); // Required to match GSI Popup frontend client
            params.add("grant_type", "authorization_code");
            
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            
            // Send the authorization request to Google
            ResponseEntity<String> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, entity, String.class);
            
            // Deserialize the response JSON body into a standard Map to safely extract id_token
            java.util.Map<String, Object> tokenMap = objectMapper.readValue(response.getBody(), java.util.Map.class);
            String idTokenStr = (String) tokenMap.get("id_token");
            if (idTokenStr == null) {
                throw new RuntimeException("Không tìm thấy id_token trong phản hồi từ Google! Phản hồi: " + response.getBody());
            }
            
            // Verify the cryptographically signed id_token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    new GsonFactory()
            )
            .setAudience(Collections.singletonList(clientId))
            .build();

            GoogleIdToken idToken = verifier.verify(idTokenStr);
            if (idToken != null) {
                return idToken.getPayload(); // Success!
            }
            throw new RuntimeException("Xác thực ID Token từ Google thất bại!");
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google code: " + e.getMessage(), e);
        }
    }
}