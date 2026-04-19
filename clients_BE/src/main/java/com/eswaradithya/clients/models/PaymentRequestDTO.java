package com.eswaradithya.clients.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * PaymentRequestDTO
 * Data Transfer Object for creating or updating payments
 * Used for API request payloads
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentRequestDTO {

    private Long serviceId;

    private Long clientId;

    private BigDecimal amount;

    private String paymentMethod;

    private LocalDate paymentDate;

    private String transactionReference;

    private String status;
}
