package com.eswaradithya.clients.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.eswaradithya.clients.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Security Configuration for JWT-based authentication
 * Configures Spring Security with JWT filters and endpoint security
 */
@Configuration
@EnableWebSecurity
@Slf4j
@RequiredArgsConstructor
public class SecurityConfiguration {

	private final JwtTokenProvider jwtTokenProvider;

	@Bean
	public PasswordEncoder passwordEncoder() {
		log.info("Initializing BCrypt Password Encoder");
		return new BCryptPasswordEncoder(10);
	}

	/**
	 * Configure security filter chain for JWT authentication with CORS support
	 * 
	 * @param http HttpSecurity to configure
	 * @return SecurityFilterChain
	 * @throws Exception
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(cors -> {}) // Enable CORS (configured in AppConfig)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(authz -> authz
				// Allow preflight requests
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				// Public endpoints - no authentication required
				.requestMatchers(HttpMethod.POST, "/eswaradithya/admins/sign-in").permitAll()
				.requestMatchers(HttpMethod.POST, "/eswaradithya/admins/save").permitAll()
				.requestMatchers(HttpMethod.GET, "/eswaradithya/admins/verify-token").permitAll()
				// All other endpoints require authentication
				.anyRequest().authenticated()
			)
			.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), 
							UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
