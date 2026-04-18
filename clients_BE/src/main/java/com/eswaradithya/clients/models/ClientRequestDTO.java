package com.eswaradithya.clients.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientRequestDTO {

	private String clientName;
	private String companyName;
	private String email;
	private String phone;
	private String websiteUrl;
	private String status;
	private String notes;

}
