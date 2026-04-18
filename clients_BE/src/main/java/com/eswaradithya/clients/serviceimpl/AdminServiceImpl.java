package com.eswaradithya.clients.serviceimpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eswaradithya.clients.entity.Admins;
import com.eswaradithya.clients.models.AdminRequestDTO;
import com.eswaradithya.clients.models.SignInRequestDTO;
import com.eswaradithya.clients.repository.AdminRepository;
import com.eswaradithya.clients.service.AdminService;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Builder
public class AdminServiceImpl implements AdminService {

	private final AdminRepository adminRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public Admins createAdminAccount(AdminRequestDTO request) {
		log.info("Creating admin account for email: {}", request.getEmail());

		// Check if email already exists
		if (adminRepository.existsByEmail(request.getEmail())) {
			log.warn("Email already exists: {}", request.getEmail());
			throw new RuntimeException("Email already exists. Please choose a different email");
		}

		// Hash password using BCrypt
		String hashedPassword = passwordEncoder.encode(request.getPasswordHash());
		log.debug("Password hashed successfully for email: {}", request.getEmail());

		Admins admin = Admins.builder().name(request.getName()).email(request.getEmail()).passwordHash(hashedPassword)
				.role(request.getRole()).build();

		Admins savedAdmin = adminRepository.save(admin);
		log.info("Admin account created successfully for email: {}", request.getEmail());

		return savedAdmin;
	}

	@Override
	public Admins signIn(SignInRequestDTO request) {
		log.info("Admin sign-in attempt for email: {}", request.getEmail());

		// Find admin by email
		Admins admin = adminRepository.findByEmail(request.getEmail()).orElseThrow(() -> {
			log.warn("Admin not found with email: {}", request.getEmail());
			return new RuntimeException("Invalid credentials");
		});

		// Verify password
		if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
			log.warn("Password mismatch for email: {}", request.getEmail());
			throw new RuntimeException("Invalid credentials");
		}

		log.info("Admin signed in successfully with email: {}", request.getEmail());
		return admin;
	}

}
