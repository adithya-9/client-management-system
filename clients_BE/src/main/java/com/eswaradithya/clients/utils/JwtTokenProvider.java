package com.eswaradithya.clients.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT Token Provider for generating and validating JWT tokens
 * Handles token creation, validation, and claims extraction
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret:your-super-secret-key-change-this-in-production-minimum-32-chars}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // Default 24 hours in milliseconds
    private long jwtExpirationInMs;

    /**
     * Generate JWT token for admin
     * 
     * @param adminId Admin ID to encode in token
     * @param email Admin email to encode in token
     * @return Generated JWT token string
     */
    public String generateToken(Long adminId, String email) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            return Jwts.builder()
                    .setSubject(email)
                    .claim("adminId", adminId)
                    .claim("email", email)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(key)
                    .compact();
        } catch (Exception ex) {
            log.error("Error generating JWT token: {}", ex.getMessage());
            throw new RuntimeException("Failed to generate JWT token", ex);
        }
    }

    /**
     * Validate JWT token
     * 
     * @param token Token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            
            return true;
        } catch (Exception ex) {
            log.error("JWT token validation failed: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Get admin email from JWT token
     * 
     * @param token JWT token
     * @return Email address from token
     */
    public String getEmailFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getSubject();
        } catch (Exception ex) {
            log.error("Error extracting email from token: {}", ex.getMessage());
            return null;
        }
    }

    /**
     * Get admin ID from JWT token
     * 
     * @param token JWT token
     * @return Admin ID from token
     */
    public Long getAdminIdFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            Object adminId = claims.get("adminId");
            if (adminId instanceof Integer) {
                return ((Integer) adminId).longValue();
            } else if (adminId instanceof Long) {
                return (Long) adminId;
            }
            return null;
        } catch (Exception ex) {
            log.error("Error extracting adminId from token: {}", ex.getMessage());
            return null;
        }
    }

    /**
     * Get expiration date from JWT token
     * 
     * @param token JWT token
     * @return Expiration date
     */
    public Date getExpirationDateFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getExpiration();
        } catch (Exception ex) {
            log.error("Error extracting expiration from token: {}", ex.getMessage());
            return null;
        }
    }

    /**
     * Check if token is expired
     * 
     * @param token JWT token
     * @return true if token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expirationDate = getExpirationDateFromToken(token);
            return expirationDate != null && expirationDate.before(new Date());
        } catch (Exception ex) {
            log.error("Error checking token expiration: {}", ex.getMessage());
            return true;
        }
    }
}
