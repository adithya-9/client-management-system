package com.eswaradithya.clients.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.eswaradithya.clients.entity.Clients;

public interface ClientRepository extends JpaRepository<Clients, Long> {
	
	boolean existsByEmail(String email);
	
	Optional<Clients> findByEmail(String email);

}
