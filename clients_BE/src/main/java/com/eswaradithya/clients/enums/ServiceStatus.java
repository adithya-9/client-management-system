package com.eswaradithya.clients.enums;

/**
 * Enum for service lifecycle status
 * Represents different states a service can be in
 */
public enum ServiceStatus {
    ACTIVE("Active - Service is running"),
    INACTIVE("Inactive - Service is paused"),
    PENDING("Pending - Awaiting activation"),
    EXPIRED("Expired - Service has expired"),
    RENEWAL_PENDING("Renewal Pending - Awaiting renewal"),
    SUSPENDED("Suspended - Service is temporarily suspended"),
    CANCELLED("Cancelled - Service has been cancelled"),
    TRIAL("Trial - Service is in trial period");

    private final String description;

    ServiceStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
