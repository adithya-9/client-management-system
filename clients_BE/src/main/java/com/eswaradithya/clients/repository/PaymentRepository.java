package com.eswaradithya.clients.repository;

import com.eswaradithya.clients.entity.Payments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PaymentRepository
 * Data access layer for Payment entity
 * Provides CRUD operations and custom queries for payments
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payments, Long> {

    /**
     * Find all payments for a specific service
     * 
     * @param serviceId ID of the service
     * @return List of payments for the service
     */
    List<Payments> findByServiceId(Long serviceId);

    /**
     * Find all payments for a specific service with pagination
     * 
     * @param serviceId ID of the service
     * @param pageable Pagination information
     * @return Page of payments for the service
     */
    Page<Payments> findByServiceId(Long serviceId, Pageable pageable);

    /**
     * Find all payments for a specific client
     * 
     * @param clientId ID of the client
     * @return List of payments made by the client
     */
    List<Payments> findByClientId(Long clientId);

    /**
     * Find all payments for a specific client with pagination
     * 
     * @param clientId ID of the client
     * @param pageable Pagination information
     * @return Page of payments made by the client
     */
    Page<Payments> findByClientId(Long clientId, Pageable pageable);

    /**
     * Find all payments for a specific service and client
     * 
     * @param serviceId ID of the service
     * @param clientId ID of the client
     * @return List of payments matching both criteria
     */
    List<Payments> findByServiceIdAndClientId(Long serviceId, Long clientId);

    /**
     * Find all payments for a specific service and client with pagination
     * 
     * @param serviceId ID of the service
     * @param clientId ID of the client
     * @param pageable Pagination information
     * @return Page of payments matching both criteria
     */
    Page<Payments> findByServiceIdAndClientId(Long serviceId, Long clientId, Pageable pageable);

    /**
     * Find payments by status
     * 
     * @param status Payment status (e.g., "SUCCESS", "PENDING", "FAILED")
     * @return List of payments with given status
     */
    List<Payments> findByStatus(String status);

    /**
     * Find payments by status with pagination
     * 
     * @param status Payment status (e.g., "SUCCESS", "PENDING", "FAILED")
     * @param pageable Pagination information
     * @return Page of payments with given status
     */
    Page<Payments> findByStatus(String status, Pageable pageable);

    /**
     * Count total payments for a service
     * 
     * @param serviceId ID of the service
     * @return Total number of payments for the service
     */
    long countByServiceId(Long serviceId);

    /**
     * Count total payments for a client
     * 
     * @param clientId ID of the client
     * @return Total number of payments made by the client
     */
    long countByClientId(Long clientId);
}
