package com.eswaradithya.clients.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.eswaradithya.clients.entity.Admins;
import com.eswaradithya.clients.models.AdminRequestDTO;
import com.eswaradithya.clients.models.LoginResponseDTO;
import com.eswaradithya.clients.models.SignInRequestDTO;
import com.eswaradithya.clients.service.AdminService;
import com.eswaradithya.clients.utils.APIResponse;
import com.eswaradithya.clients.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/eswaradithya/admins")
@Slf4j
@RequiredArgsConstructor
public class AdminController {

	private final AdminService adminService;
	private final JwtTokenProvider jwtTokenProvider;

	@Value("${jwt.expiration:86400000}")
	private long jwtExpirationInMs;

	@PostMapping("/save")
	public ResponseEntity<APIResponse<Admins>> createAdminAccount(@RequestBody AdminRequestDTO request) {
		try {
			Admins saveAdmin = adminService.createAdminAccount(request);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(APIResponse.success(2001, "Admin created Successfully", saveAdmin));

		} catch (RuntimeException ex) {
			log.error("Error creating admin account: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(APIResponse.error(4001, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}

	}

	/**
	 * Admin sign-in endpoint with JWT token generation
	 * 
	 * @param request SignInRequestDTO with email and password
	 * @return ResponseEntity with APIResponse containing LoginResponseDTO with JWT token
	 */
	@PostMapping("/sign-in")
	public ResponseEntity<APIResponse<LoginResponseDTO>> signIn(@RequestBody SignInRequestDTO request) {
		try {
			log.info("Admin sign-in attempt for email: {}", request.getEmail());
			Admins admin = adminService.signIn(request);
			
			// Generate JWT token
			String token = jwtTokenProvider.generateToken(admin.getAdminId(), admin.getEmail());
			LoginResponseDTO response = LoginResponseDTO.from(admin, token, jwtExpirationInMs);
			
			log.info("Admin signed in successfully: {}", request.getEmail());
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Sign-in successful", response));

		} catch (RuntimeException ex) {
			log.error("Sign-in failed: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(APIResponse.error(4001, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error during sign-in: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	/**
	 * Verify JWT token validity
	 * GET /eswaradithya/admins/verify-token
	 * 
	 * @param authHeader Authorization header containing Bearer token
	 * @return ResponseEntity confirming token is valid
	 */
	@GetMapping("/verify-token")
	public ResponseEntity<APIResponse<String>> verifyToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
		try {
			log.info("Verifying JWT token");
			
			// Check if Authorization header exists
			if (authHeader == null || authHeader.isEmpty()) {
				log.error("Authorization header is missing");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(APIResponse.error(4001, "Authorization header is missing"));
			}
			
			// Extract token from Bearer scheme
			String token = null;
			if (authHeader.startsWith("Bearer ")) {
				token = authHeader.substring(7); // Remove "Bearer " prefix
			} else {
				log.error("Invalid Authorization header format");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(APIResponse.error(4001, "Invalid Authorization header format"));
			}
			
			// Validate token
			if (jwtTokenProvider.validateToken(token)) {
				log.info("Token is valid");
				return ResponseEntity.status(HttpStatus.OK)
						.body(APIResponse.success(2000, "Token is valid", "Token verified successfully"));
			} else {
				log.error("Token validation failed");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(APIResponse.error(4001, "Token is invalid or expired"));
			}

		} catch (Exception ex) {
			log.error("Token verification failed: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(APIResponse.error(4001, "Token is invalid or expired"));
		}
	}

}
