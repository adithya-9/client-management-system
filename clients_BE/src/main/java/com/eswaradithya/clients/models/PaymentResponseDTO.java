package com.eswaradithya.clients.models;

import com.eswaradithya.clients.entity.Payments;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * PaymentResponseDTO
 * Data Transfer Object for returning payment data
 * Used for API response payloads
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponseDTO {

    private Long paymentId;

    private Long serviceId;

    private Long clientId;

    private BigDecimal amount;

    private String paymentMethod;

    private LocalDate paymentDate;

    private String transactionReference;
    
    private String status;

    private LocalDateTime createdAt;

    public static PaymentResponseDTO from(Payments payment) {
        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .serviceId(payment.getServiceId())
                .clientId(payment.getClientId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentDate(payment.getPaymentDate())
                .transactionReference(payment.getTransactionReference())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
