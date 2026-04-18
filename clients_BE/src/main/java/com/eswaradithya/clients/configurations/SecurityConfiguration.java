package com.eswaradithya.clients.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class SecurityConfiguration {
	@Bean
	public PasswordEncoder passwordEncoder() {
		log.info("Initializing BCrypt Password Encoder");
		return new BCryptPasswordEncoder(10);
	}

}
