package com.eswaradithya.clients.service;

import com.eswaradithya.clients.entity.Payments;
import com.eswaradithya.clients.models.PaymentRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * PaymentService
 * Service interface for payment-related operations
 * Defines business logic for creating, retrieving, and managing payments
 */
public interface PaymentService {

    /**
     * Create a new payment record
     * 
     * @param paymentRequest Payment data
     * @return Created payment entity
     * @throws RuntimeException if service or client not found, or invalid data
     */
    Payments createPayment(PaymentRequestDTO paymentRequest);

    /**
     * Get a payment by ID
     * 
     * @param paymentId Payment ID
     * @return Payment entity if found
     * @throws RuntimeException if payment not found
     */
    Payments getPaymentById(Long paymentId);

    /**
     * Get all payments for a specific service
     * 
     * @param serviceId Service ID
     * @return List of payments for the service
     */
    List<Payments> getPaymentsByService(Long serviceId);

    /**
     * Get all payments for a specific service with pagination
     * 
     * @param serviceId Service ID
     * @param pageable Pagination info
     * @return Page of payments for the service
     */
    Page<Payments> getPaymentsByService(Long serviceId, Pageable pageable);

    /**
     * Get all payments for a specific client
     * 
     * @param clientId Client ID
     * @return List of payments by the client
     */
    List<Payments> getPaymentsByClient(Long clientId);

    /**
     * Get all payments for a specific client with pagination
     * 
     * @param clientId Client ID
     * @param pageable Pagination info
     * @return Page of payments by the client
     */
    Page<Payments> getPaymentsByClient(Long clientId, Pageable pageable);

    /**
     * Get all payments for a service-client combination
     * 
     * @param serviceId Service ID
     * @param clientId Client ID
     * @return List of payments matching both criteria
     */
    List<Payments> getPaymentsByServiceAndClient(Long serviceId, Long clientId);

    /**
     * Get all payments for a service-client combination with pagination
     * 
     * @param serviceId Service ID
     * @param clientId Client ID
     * @param pageable Pagination info
     * @return Page of payments matching both criteria
     */
    Page<Payments> getPaymentsByServiceAndClient(Long serviceId, Long clientId, Pageable pageable);

    /**
     * Update an existing payment
     * 
     * @param paymentId Payment ID to update
     * @param paymentRequest Updated payment data
     * @return Updated payment entity
     * @throws RuntimeException if payment, service, or client not found
     */
    Payments updatePayment(Long paymentId, PaymentRequestDTO paymentRequest);

    /**
     * Delete a payment by ID
     * 
     * @param paymentId Payment ID to delete
     * @throws RuntimeException if payment not found
     */
    void deletePayment(Long paymentId);

    /**
     * Get total amount paid for a service
     * 
     * @param serviceId Service ID
     * @return Total amount of successful payments
     */
    java.math.BigDecimal getTotalPaymentForService(Long serviceId);

    /**
     * Get total amount paid by a client
     * 
     * @param clientId Client ID
     * @return Total amount of successful payments by client
     */
    java.math.BigDecimal getTotalPaymentByClient(Long clientId);

    /**
     * Count total payments for a service
     * 
     * @param serviceId Service ID
     * @return Total count of payments
     */
    long countPaymentsByService(Long serviceId);

    /**
     * Count total payments by a client
     * 
     * @param clientId Client ID
     * @return Total count of payments by client
     */
    long countPaymentsByClient(Long clientId);
}
