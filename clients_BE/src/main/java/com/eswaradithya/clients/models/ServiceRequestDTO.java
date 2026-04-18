package com.eswaradithya.clients.models;

import java.math.BigDecimal;
import java.time.LocalDate;

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
public class ServiceRequestDTO {

    private Long clientId;
    private String serviceType; // Will be converted to enum
    private String serviceName;
    private String provider;
    private LocalDate purchaseDate;
    private LocalDate expiryDate;
    private BigDecimal price;
    private String billingCycle;
    private String status; // Will be converted to enum
}
