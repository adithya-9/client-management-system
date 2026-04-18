package com.eswaradithya.clients.enums;

/**
 * Enum for different types of services offered to clients
 * Based on common service categories from 10+ years of client management
 */
public enum ServiceType {
    WEB_HOSTING("Web Hosting"),
    DOMAIN("Domain Registration"),
    SSL_CERTIFICATE("SSL Certificate"),
    EMAIL_HOSTING("Email Hosting"),
    SEO_SERVICE("SEO Service"),
    MAINTENANCE_SUPPORT("Maintenance & Support"),
    CLOUD_STORAGE("Cloud Storage"),
    SECURITY_SERVICE("Security Service"),
    BACKUP_SERVICE("Backup Service"),
    MONITORING_SERVICE("Monitoring Service"),
    CDN_SERVICE("CDN Service"),
    DATABASE_SERVICE("Database Service"),
    API_SERVICE("API Service"),
    CUSTOM_DEVELOPMENT("Custom Development"),
    CONSULTATION("Consultation"),
    MOBILE_APP("Mobile App Development"),
    WEB_DEVELOPMENT("Web Development"),
    WORDPRESS_MAINTENANCE("WordPress Maintenance"),
    ANALYTICS_TRACKING("Analytics & Tracking"),
    PERFORMANCE_OPTIMIZATION("Performance Optimization");

    private final String displayName;

    ServiceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
