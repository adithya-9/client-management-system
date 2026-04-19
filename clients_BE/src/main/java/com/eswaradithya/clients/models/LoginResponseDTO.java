package com.eswaradithya.clients.models;

import com.eswaradithya.clients.entity.Admins;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO for login response containing JWT token and admin info
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponseDTO {
    
    private Long adminId;
    private String email;
    private String name;
    private String role;
    private String token;
    private String tokenType = "Bearer";
    private Long expiresIn; // Token expiration time in milliseconds
    private LocalDateTime createdAt;

    /**
     * Create LoginResponseDTO from Admins entity and JWT token
     * 
     * @param admin Admins entity
     * @param token JWT token
     * @param expiresIn Token expiration time in milliseconds
     * @return LoginResponseDTO instance
     */
    public static LoginResponseDTO from(Admins admin, String token, Long expiresIn) {
        return LoginResponseDTO.builder()
                .adminId(admin.getAdminId())
                .email(admin.getEmail())
                .name(admin.getName())
                .role(admin.getRole())
                .token(token)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .createdAt(admin.getCreatedAt())
                .build();
    }
}
