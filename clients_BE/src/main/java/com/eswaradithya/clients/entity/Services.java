package com.eswaradithya.clients.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.eswaradithya.clients.enums.ServiceStatus;
import com.eswaradithya.clients.enums.ServiceType;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "services", schema = "admins")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false, foreignKey = @ForeignKey(name = "fk_services_client"))
    private Clients client;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "provider")
    private String provider;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "price", precision = 38, scale = 2)
    private BigDecimal price;

    @Column(name = "billing_cycle")
    private String billingCycle; // Monthly, Quarterly, Yearly, One-time

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ServiceStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
