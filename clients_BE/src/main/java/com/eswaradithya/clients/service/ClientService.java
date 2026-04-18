package com.eswaradithya.clients.service;

import java.util.List;
import com.eswaradithya.clients.entity.Clients;
import com.eswaradithya.clients.models.ClientRequestDTO;

public interface ClientService {
	
	Clients saveClient(ClientRequestDTO request);
	
	List<Clients> getAllClients();
	
	Clients getClientById(Long clientId);
	
	void deleteClient(Long clientId);

}
