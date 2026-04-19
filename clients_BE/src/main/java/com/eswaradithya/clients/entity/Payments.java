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
 * Payment Entity
 * Represents payment records for services provided to clients
 * Each service can have multiple payments
 * 
 * Relationships:
 * - Many-to-One with Services: Multiple payments can belong to one service
 * - Many-to-One with Clients: Multiple payments can belong to one client
 */
@Entity
@Table(name = "payments", schema = "admins")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payments {

    /**
     * Primary key - auto-generated payment ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    /**
     * Foreign key relationship to Services table
     * Represents which service this payment is for
     * Fetch type: LAZY - load only when accessed
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;

    /**
     * Service ID (duplicated for direct access without loading service entity)
     */
    @Column(name = "service_id", insertable = false, updatable = false)
    private Long serviceId;

    /**
     * Foreign key relationship to Clients table
     * Represents which client made this payment
     * Fetch type: LAZY - load only when accessed
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Clients client;

    /**
     * Client ID (duplicated for direct access without loading client entity)
     */
    @Column(name = "client_id", insertable = false, updatable = false)
    private Long clientId;

    /**
     * Payment amount in currency units
     * Stored as decimal(38,2) in database
     * Precision: 38 digits, Scale: 2 decimal places
     */
    @Column(name = "amount", nullable = false, precision = 38, scale = 2)
    private BigDecimal amount;

    /**
     * Payment method used
     * Examples: "Credit Card", "Debit Card", "Bank Transfer", "Cheque", "Cash", "UPI", etc.
     */
    @Column(name = "payment_method", length = 255)
    private String paymentMethod;

    /**
     * Date when payment was received/processed
     */
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    /**
     * Transaction reference/receipt/invoice number
     * Used for reconciliation and tracking
     */
    @Column(name = "transaction_reference", length = 255)
    private String transactionReference;

    /**
     * Payment status
     * Default value: 'SUCCESS'
     * Possible values: SUCCESS, PENDING, FAILED, REFUNDED, CANCELLED
     */
    @Column(name = "status", length = 255)
    private String status;

    /**
     * Timestamp when payment record was created
     * Automatically set by database on insert
     * Not updatable after creation
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * JPA lifecycle callback method
     * Called automatically before entity is persisted to database
     * Sets default values for timestamp and status
     */
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
