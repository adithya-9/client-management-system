package com.eswaradithya.clients.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Payment Entity Represents payment records for services provided to clients
 * Each service can have multiple payments
 * 
 * Relationships: - Many-to-One with Services: Multiple payments can belong to
 * one service - Many-to-One with Clients: Multiple payments can belong to one
 * client
 */
@Entity
@Table(name = "payments", schema = "admins")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payments {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payment_id")
	private Long paymentId;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "service_id", nullable = false)
	
	private Services service;
	@Column(name = "service_id", insertable = false, updatable = false)
	private Long serviceId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "client_id", nullable = false)
	private Clients client;

	@Column(name = "client_id", insertable = false, updatable = false)
	private Long clientId;

	@Column(name = "amount", nullable = false, precision = 38, scale = 2)
	private BigDecimal amount;

	@Column(name = "payment_method", length = 255)
	private String paymentMethod;

	@Column(name = "payment_date")
	private LocalDate paymentDate;

	@Column(name = "transaction_reference", length = 255)
	private String transactionReference;

	@Column(name = "status", length = 255)
	private String status;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		if (createdAt == null) {
			createdAt = LocalDateTime.now();
		}
		if (status == null) {
			status = "SUCCESS";
		}
	}
}
