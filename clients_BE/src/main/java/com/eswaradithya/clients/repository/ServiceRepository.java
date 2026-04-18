package com.eswaradithya.clients.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.eswaradithya.clients.entity.Services;

public interface ServiceRepository extends JpaRepository<Services, Long> {
    
    /**
     * Find all services for a specific client with pagination
     */
    Page<Services> findByClientClientId(Long clientId, Pageable pageable);
    
    /**
     * Find all services for a specific client without pagination
     */
    List<Services> findByClientClientId(Long clientId);
}
