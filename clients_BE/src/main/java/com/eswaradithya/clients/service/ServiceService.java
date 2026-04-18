package com.eswaradithya.clients.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.eswaradithya.clients.models.ServiceRequestDTO;
import com.eswaradithya.clients.models.ServiceResponseDTO;

public interface ServiceService {
    
    /**
     * Create a new service for a client
     */
    ServiceResponseDTO createService(ServiceRequestDTO request);
    
    /**
     * Get all services for a client with pagination
     */
    Page<ServiceResponseDTO> getServicesByClient(Long clientId, Pageable pageable);
    
    /**
     * Get a specific service by ID
     */
    ServiceResponseDTO getServiceById(Long serviceId);
    
    /**
     * Update an existing service
     */
    ServiceResponseDTO updateService(Long serviceId, ServiceRequestDTO request);
    
    /**
     * Delete a service
     */
    void deleteService(Long serviceId);
}
