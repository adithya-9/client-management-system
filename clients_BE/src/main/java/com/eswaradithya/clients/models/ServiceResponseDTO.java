package com.eswaradithya.clients.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.eswaradithya.clients.enums.ServiceStatus;
import com.eswaradithya.clients.enums.ServiceType;

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
public class ServiceResponseDTO {

    private Long serviceId;
    private Long clientId;
    private String clientName;
    private ServiceType serviceType;
    private String serviceName;
    private String provider;
    private LocalDate purchaseDate;
    private LocalDate expiryDate;
    private BigDecimal price;
    private String billingCycle;
    private ServiceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String expiryStatus; // "EXPIRED", "EXPIRING_SOON", "ACTIVE"
}
