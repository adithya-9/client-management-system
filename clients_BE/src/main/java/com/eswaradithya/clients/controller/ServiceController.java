package com.eswaradithya.clients.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eswaradithya.clients.models.ServiceRequestDTO;
import com.eswaradithya.clients.models.ServiceResponseDTO;
import com.eswaradithya.clients.service.ServiceService;
import com.eswaradithya.clients.utils.APIResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/eswaradithya/services")
@Slf4j
@RequiredArgsConstructor
public class ServiceController {

	private final ServiceService serviceService;

	@PostMapping("/{clientId}")
	public ResponseEntity<APIResponse<ServiceResponseDTO>> createService(@PathVariable Long clientId,
			@RequestBody ServiceRequestDTO request) {
		try {
			log.info("Creating service for client ID: {}", clientId);
			request.setClientId(clientId);
			ServiceResponseDTO savedService = serviceService.createService(request);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(APIResponse.success(2001, "Service created successfully", savedService));

		} catch (RuntimeException ex) {
			log.error("Error creating service: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(APIResponse.error(4001, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while creating service: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@GetMapping("/client/{clientId}")
	public ResponseEntity<APIResponse<Page<ServiceResponseDTO>>> getServicesByClient(@PathVariable Long clientId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "serviceId") String sortBy,
			@RequestParam(defaultValue = "DESC") String sortDirection) {
		try {
			log.info("Fetching services for client ID: {} with pagination", clientId);
			Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
			Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

			Page<ServiceResponseDTO> services = serviceService.getServicesByClient(clientId, pageable);
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Services retrieved successfully", services));

		} catch (RuntimeException ex) {
			log.error("Error retrieving services: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(4004, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while retrieving services: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@GetMapping("/{serviceId}")
	public ResponseEntity<APIResponse<ServiceResponseDTO>> getServiceById(@PathVariable Long serviceId) {
		try {
			log.info("Fetching service with ID: {}", serviceId);
			ServiceResponseDTO service = serviceService.getServiceById(serviceId);
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Service retrieved successfully", service));

		} catch (RuntimeException ex) {
			log.error("Service not found with ID: {}", serviceId);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(4004, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while retrieving service: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@PutMapping("/{serviceId}")
	public ResponseEntity<APIResponse<ServiceResponseDTO>> updateService(@PathVariable Long serviceId,
			@RequestBody ServiceRequestDTO request) {
		try {
			log.info("Updating service with ID: {}", serviceId);
			ServiceResponseDTO updatedService = serviceService.updateService(serviceId, request);
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Service updated successfully", updatedService));

		} catch (RuntimeException ex) {
			log.error("Error updating service: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(APIResponse.error(4001, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while updating service: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@DeleteMapping("/{serviceId}")
	public ResponseEntity<APIResponse<Void>> deleteService(@PathVariable Long serviceId) {
		try {
			log.info("Deleting service with ID: {}", serviceId);
			serviceService.deleteService(serviceId);
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Service deleted successfully", null));

		} catch (RuntimeException ex) {
			log.error("Service not found with ID: {}", serviceId);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(4004, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while deleting service: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}
}
