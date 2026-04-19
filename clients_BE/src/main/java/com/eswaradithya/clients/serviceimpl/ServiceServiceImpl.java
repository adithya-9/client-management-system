package com.eswaradithya.clients.serviceimpl;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eswaradithya.clients.entity.Clients;
import com.eswaradithya.clients.entity.Services;
import com.eswaradithya.clients.enums.ServiceStatus;
import com.eswaradithya.clients.enums.ServiceType;
import com.eswaradithya.clients.models.ServiceRequestDTO;
import com.eswaradithya.clients.models.ServiceResponseDTO;
import com.eswaradithya.clients.repository.ClientRepository;
import com.eswaradithya.clients.repository.ServiceRepository;
import com.eswaradithya.clients.service.ServiceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

	private final ServiceRepository serviceRepository;
	private final ClientRepository clientRepository;

	@Override
	public ServiceResponseDTO createService(ServiceRequestDTO request) {
		log.info("Creating service: {} for client ID: {}", request.getServiceName(), request.getClientId());

		// Validate client exists
		Clients client = clientRepository.findById(request.getClientId()).orElseThrow(() -> {
			log.error("Client not found with ID: {}", request.getClientId());
			return new RuntimeException("Client not found with ID: " + request.getClientId());
		});

		// Validate dates
		if (request.getPurchaseDate() != null && request.getExpiryDate() != null) {
			if (request.getExpiryDate().isBefore(request.getPurchaseDate())) {
				log.warn("Expiry date cannot be before purchase date");
				throw new RuntimeException("Expiry date cannot be before purchase date");
			}
		}

		// Validate price
		if (request.getPrice() != null && request.getPrice().signum() < 0) {
			log.warn("Price cannot be negative");
			throw new RuntimeException("Price cannot be negative");
		}

		Services service = Services.builder().client(client).serviceType(ServiceType.valueOf(request.getServiceType()))
				.serviceName(request.getServiceName()).provider(request.getProvider())
				.purchaseDate(request.getPurchaseDate()).expiryDate(request.getExpiryDate()).price(request.getPrice())
				.billingCycle(request.getBillingCycle())
				.status(request.getStatus() != null ? ServiceStatus.valueOf(request.getStatus()) : ServiceStatus.ACTIVE)
				.createdAt(LocalDateTime.now()).build();

		Services savedService = serviceRepository.save(service);
		log.info("Service created successfully with ID: {}", savedService.getServiceId());

		return mapToResponseDTO(savedService);
	}

	@Override
	public Page<ServiceResponseDTO> getServicesByClient(Long clientId, Pageable pageable) {
		log.info("Fetching services for client ID: {}", clientId);

		// Validate client exists
		if (!clientRepository.existsById(clientId)) {
			log.error("Client not found with ID: {}", clientId);
			throw new RuntimeException("Client not found with ID: " + clientId);
		}

		Page<Services> services = serviceRepository.findByClientClientId(clientId, pageable);
		log.info("Retrieved {} services for client ID: {}", services.getTotalElements(), clientId);

		return services.map(this::mapToResponseDTO);
	}

	@Override
	public ServiceResponseDTO getServiceById(Long serviceId) {
		log.info("Fetching service with ID: {}", serviceId);

		Services service = serviceRepository.findById(serviceId).orElseThrow(() -> {
			log.error("Service not found with ID: {}", serviceId);
			return new RuntimeException("Service not found with ID: " + serviceId);
		});

		return mapToResponseDTO(service);
	}

	@Override
	public ServiceResponseDTO updateService(Long serviceId, ServiceRequestDTO request) {
		log.info("Updating service with ID: {}", serviceId);

		Services service = serviceRepository.findById(serviceId).orElseThrow(() -> {
			log.error("Service not found with ID: {}", serviceId);
			return new RuntimeException("Service not found with ID: " + serviceId);
		});

		// Validate dates
		if (request.getPurchaseDate() != null && request.getExpiryDate() != null) {
			if (request.getExpiryDate().isBefore(request.getPurchaseDate())) {
				log.warn("Expiry date cannot be before purchase date");
				throw new RuntimeException("Expiry date cannot be before purchase date");
			}
		}

		// Validate price
		if (request.getPrice() != null && request.getPrice().signum() < 0) {
			log.warn("Price cannot be negative");
			throw new RuntimeException("Price cannot be negative");
		}

		service.setServiceType(ServiceType.valueOf(request.getServiceType()));
		service.setServiceName(request.getServiceName());
		service.setProvider(request.getProvider());
		service.setPurchaseDate(request.getPurchaseDate());
		service.setExpiryDate(request.getExpiryDate());
		service.setPrice(request.getPrice());
		service.setBillingCycle(request.getBillingCycle());
		service.setStatus(ServiceStatus.valueOf(request.getStatus()));
		service.setUpdatedAt(LocalDateTime.now());

		Services updatedService = serviceRepository.save(service);
		log.info("Service updated successfully with ID: {}", updatedService.getServiceId());

		return mapToResponseDTO(updatedService);
	}

	@Override
	public void deleteService(Long serviceId) {
		log.info("Deleting service with ID: {}", serviceId);

		if (!serviceRepository.existsById(serviceId)) {
			log.error("Service not found with ID: {}", serviceId);
			throw new RuntimeException("Service not found with ID: " + serviceId);
		}

		serviceRepository.deleteById(serviceId);
		log.info("Service deleted successfully with ID: {}", serviceId);
	}

	@Override
	public java.util.List<ServiceResponseDTO> getAllServices() {
		log.info("Fetching all services across all clients");

		java.util.List<Services> services = serviceRepository.findAll();
		log.info("Retrieved {} services total", services.size());

		return services.stream().map(this::mapToResponseDTO).collect(java.util.stream.Collectors.toList());
	}

	/**
	 * Helper method to map Service entity to ServiceResponseDTO Also calculates
	 * expiry status based on expiry date
	 */
	private ServiceResponseDTO mapToResponseDTO(Services service) {
		String expiryStatus = calculateExpiryStatus(service.getExpiryDate());

		return ServiceResponseDTO.builder().serviceId(service.getServiceId())
				.clientId(service.getClient().getClientId()).clientName(service.getClient().getClientName())
				.serviceType(service.getServiceType()).serviceName(service.getServiceName())
				.provider(service.getProvider()).purchaseDate(service.getPurchaseDate())
				.expiryDate(service.getExpiryDate()).price(service.getPrice()).billingCycle(service.getBillingCycle())
				.status(service.getStatus()).createdAt(service.getCreatedAt()).updatedAt(service.getUpdatedAt())
				.expiryStatus(expiryStatus).build();
	}

	/**
	 * Calculate expiry status based on expiry date Returns: "EXPIRED",
	 * "EXPIRING_SOON", or "ACTIVE"
	 */
	private String calculateExpiryStatus(LocalDate expiryDate) {
		if (expiryDate == null) {
			return "ACTIVE";
		}

		LocalDate today = LocalDate.now();

		if (expiryDate.isBefore(today)) {
			return "EXPIRED";
		} else if (expiryDate.minusDays(7).isBefore(today) || expiryDate.minusDays(7).isEqual(today)) {
			return "EXPIRING_SOON";
		} else {
			return "ACTIVE";
		}
	}
}
