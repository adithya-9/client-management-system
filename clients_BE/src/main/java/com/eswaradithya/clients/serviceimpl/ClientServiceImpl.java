package com.eswaradithya.clients.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.eswaradithya.clients.entity.Clients;
import com.eswaradithya.clients.models.ClientRequestDTO;
import com.eswaradithya.clients.repository.ClientRepository;
import com.eswaradithya.clients.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

	private final ClientRepository clientRepository;

	@Override
	public Clients saveClient(ClientRequestDTO request) {
		log.info("Saving client with name: {} and email: {}", request.getClientName(), request.getEmail());

		// Check if email already exists
		if (clientRepository.existsByEmail(request.getEmail())) {
			log.warn("Email already exists: {}", request.getEmail());
			throw new RuntimeException("Email already exists. Please choose a different email");
		}

		Clients client = Clients.builder()
				.clientName(request.getClientName())
				.companyName(request.getCompanyName())
				.email(request.getEmail())
				.phone(request.getPhone())
				.websiteUrl(request.getWebsiteUrl())
				.status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
				.notes(request.getNotes())
				.createdAt(LocalDateTime.now())
				.build();

		Clients savedClient = clientRepository.save(client);
		log.info("Client saved successfully with ID: {}", savedClient.getClientId());

		return savedClient;
	}

	@Override
	public List<Clients> getAllClients() {
		log.info("Fetching all clients");
		List<Clients> clients = clientRepository.findAll();
		log.info("Retrieved {} clients", clients.size());
		return clients;
	}

	@Override
	public Clients getClientById(Long clientId) {
		log.info("Fetching client with ID: {}", clientId);
		Clients client = clientRepository.findById(clientId)
				.orElseThrow(() -> {
					log.error("Client not found with ID: {}", clientId);
					return new RuntimeException("Client not found with ID: " + clientId);
				});
		return client;
	}

	@Override
	public void deleteClient(Long clientId) {
		log.info("Deleting client with ID: {}", clientId);
		
		// Check if client exists
		if (!clientRepository.existsById(clientId)) {
			log.error("Client not found with ID: {}", clientId);
			throw new RuntimeException("Client not found with ID: " + clientId);
		}
		
		clientRepository.deleteById(clientId);
		log.info("Client deleted successfully with ID: {}", clientId);
	}

}
