package com.eswaradithya.clients.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eswaradithya.clients.entity.Clients;
import com.eswaradithya.clients.models.ClientRequestDTO;
import com.eswaradithya.clients.service.ClientService;
import com.eswaradithya.clients.utils.APIResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/eswaradithya/clients")
@Slf4j
@RequiredArgsConstructor
public class ClientController {

	private final ClientService clientService;

	@PostMapping("/save")
	public ResponseEntity<APIResponse<Clients>> saveClient(@RequestBody ClientRequestDTO request) {
		try {
			log.info("Creating new client with email: {}", request.getEmail());
			Clients savedClient = clientService.saveClient(request);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(APIResponse.success(2001, "Client created successfully", savedClient));

		} catch (RuntimeException ex) {
			log.error("Error creating client: {}", ex.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(APIResponse.error(4001, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while creating client: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@GetMapping("/all")
	public ResponseEntity<APIResponse<List<Clients>>> getAllClients() {
		try {
			log.info("Fetching all clients");
			List<Clients> clients = clientService.getAllClients();
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Clients retrieved successfully", clients));

		} catch (Exception ex) {
			log.error("Error retrieving all clients: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@GetMapping("/{clientId}")
	public ResponseEntity<APIResponse<Clients>> getClientById(@PathVariable Long clientId) {
		try {
			log.info("Fetching client with ID: {}", clientId);
			Clients client = clientService.getClientById(clientId);
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Client retrieved successfully", client));

		} catch (RuntimeException ex) {
			log.error("Client not found with ID: {}", clientId);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(4004, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while retrieving client: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

	@DeleteMapping("/{clientId}")
	public ResponseEntity<APIResponse<Void>> deleteClient(@PathVariable Long clientId) {
		try {
			log.info("Deleting client with ID: {}", clientId);
			clientService.deleteClient(clientId);
			return ResponseEntity.status(HttpStatus.OK)
					.body(APIResponse.success(2000, "Client deleted successfully", null));

		} catch (RuntimeException ex) {
			log.error("Client not found with ID: {}", clientId);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(4004, ex.getMessage()));
		} catch (Exception ex) {
			log.error("Unexpected error while deleting client: {}", ex.getMessage(), ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(APIResponse.error(5001, "Something went wrong"));
		}
	}

}
