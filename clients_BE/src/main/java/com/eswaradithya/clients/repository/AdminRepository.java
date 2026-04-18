package com.eswaradithya.clients.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.eswaradithya.clients.entity.Admins;

public interface AdminRepository extends JpaRepository<Admins, Long> {
	boolean existsByEmail(String email);
	
	Optional<Admins> findByEmail(String email);

}
