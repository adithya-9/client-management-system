package com.eswaradithya.clients.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clients", schema = "admins")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Clients {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "client_id")
	private Long clientId;

	@Column(name = "client_name", nullable = false)
	private String clientName;

	@Column(name = "company_name")
	private String companyName;

	@Column(name = "email", unique = true)
	private String email;

	@Column(name = "phone")
	private String phone;

	@Column(name = "website_url")
	private String websiteUrl;

	@Column(name = "status")
	private String status;

	@Column(name = "notes")
	private String notes;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@JsonIgnore
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Services> services = new ArrayList<>();

	/**
	 * One-to-Many relationship with Payments
	 * One client can have multiple payments for their services
	 * Cascade delete: when client is deleted, all associated payments are deleted
	 */
	@JsonIgnore
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Payments> payments = new ArrayList<>();
}
