package com.eswaradithya.clients.serviceimpl;

import com.eswaradithya.clients.entity.Clients;
import com.eswaradithya.clients.entity.Payments;
import com.eswaradithya.clients.entity.Services;
import com.eswaradithya.clients.models.PaymentRequestDTO;
import com.eswaradithya.clients.repository.ClientRepository;
import com.eswaradithya.clients.repository.PaymentRepository;
import com.eswaradithya.clients.repository.ServiceRepository;
import com.eswaradithya.clients.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * PaymentServiceImpl
 * Implementation of PaymentService
 * Handles all payment-related business logic
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ServiceRepository serviceRepository;
    private final ClientRepository clientRepository;

    @Override
    public Payments createPayment(PaymentRequestDTO paymentRequest) {
        log.info("Creating payment for service: {} and client: {}", 
                paymentRequest.getServiceId(), paymentRequest.getClientId());

        // Validate that service exists
        Services service = serviceRepository.findById(paymentRequest.getServiceId())
                .orElseThrow(() -> {
                    log.error("Service not found with ID: {}", paymentRequest.getServiceId());
                    return new RuntimeException("Service not found with ID: " + paymentRequest.getServiceId());
                });

        // Validate that client exists
        Clients client = clientRepository.findById(paymentRequest.getClientId())
                .orElseThrow(() -> {
                    log.error("Client not found with ID: {}", paymentRequest.getClientId());
                    return new RuntimeException("Client not found with ID: " + paymentRequest.getClientId());
                });

        // Validate amount
        if (paymentRequest.getAmount() == null || paymentRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            log.error("Invalid payment amount: {}", paymentRequest.getAmount());
            throw new RuntimeException("Payment amount must be greater than zero");
        }

        // Create payment entity
        Payments payment = Payments.builder()
                .service(service)
                .serviceId(paymentRequest.getServiceId())
                .client(client)
                .clientId(paymentRequest.getClientId())
                .amount(paymentRequest.getAmount())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .paymentDate(paymentRequest.getPaymentDate() != null ? paymentRequest.getPaymentDate() : LocalDate.now())
                .transactionReference(paymentRequest.getTransactionReference())
                .status(paymentRequest.getStatus() != null ? paymentRequest.getStatus() : "SUCCESS")
                .build();

        Payments savedPayment = paymentRepository.save(payment);
        log.info("Payment created successfully with ID: {}", savedPayment.getPaymentId());

        return savedPayment;
    }

    @Override
    @Transactional(readOnly = true)
    public Payments getPaymentById(Long paymentId) {
        log.info("Fetching payment with ID: {}", paymentId);

        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> {
                    log.error("Payment not found with ID: {}", paymentId);
                    return new RuntimeException("Payment not found with ID: " + paymentId);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payments> getPaymentsByService(Long serviceId) {
        log.info("Fetching payments for service ID: {}", serviceId);

        // Validate service exists
        if (!serviceRepository.existsById(serviceId)) {
            log.error("Service not found with ID: {}", serviceId);
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        return paymentRepository.findByServiceId(serviceId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Payments> getPaymentsByService(Long serviceId, Pageable pageable) {
        log.info("Fetching paginated payments for service ID: {}", serviceId);

        // Validate service exists
        if (!serviceRepository.existsById(serviceId)) {
            log.error("Service not found with ID: {}", serviceId);
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        return paymentRepository.findByServiceId(serviceId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payments> getPaymentsByClient(Long clientId) {
        log.info("Fetching payments for client ID: {}", clientId);

        // Validate client exists
        if (!clientRepository.existsById(clientId)) {
            log.error("Client not found with ID: {}", clientId);
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        return paymentRepository.findByClientId(clientId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Payments> getPaymentsByClient(Long clientId, Pageable pageable) {
        log.info("Fetching paginated payments for client ID: {}", clientId);

        // Validate client exists
        if (!clientRepository.existsById(clientId)) {
            log.error("Client not found with ID: {}", clientId);
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        return paymentRepository.findByClientId(clientId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payments> getPaymentsByServiceAndClient(Long serviceId, Long clientId) {
        log.info("Fetching payments for service ID: {} and client ID: {}", serviceId, clientId);

        // Validate both exist
        if (!serviceRepository.existsById(serviceId)) {
            log.error("Service not found with ID: {}", serviceId);
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        if (!clientRepository.existsById(clientId)) {
            log.error("Client not found with ID: {}", clientId);
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        return paymentRepository.findByServiceIdAndClientId(serviceId, clientId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Payments> getPaymentsByServiceAndClient(Long serviceId, Long clientId, Pageable pageable) {
        log.info("Fetching paginated payments for service ID: {} and client ID: {}", serviceId, clientId);

        // Validate both exist
        if (!serviceRepository.existsById(serviceId)) {
            log.error("Service not found with ID: {}", serviceId);
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        if (!clientRepository.existsById(clientId)) {
            log.error("Client not found with ID: {}", clientId);
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        return paymentRepository.findByServiceIdAndClientId(serviceId, clientId, pageable);
    }

    @Override
    public Payments updatePayment(Long paymentId, PaymentRequestDTO paymentRequest) {
        log.info("Updating payment with ID: {}", paymentId);

        Payments payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> {
                    log.error("Payment not found with ID: {}", paymentId);
                    return new RuntimeException("Payment not found with ID: " + paymentId);
                });

        // Update fields if provided
        if (paymentRequest.getAmount() != null) {
            if (paymentRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                log.error("Invalid payment amount: {}", paymentRequest.getAmount());
                throw new RuntimeException("Payment amount must be greater than zero");
            }
            payment.setAmount(paymentRequest.getAmount());
        }

        if (paymentRequest.getPaymentMethod() != null) {
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        }

        if (paymentRequest.getPaymentDate() != null) {
            payment.setPaymentDate(paymentRequest.getPaymentDate());
        }

        if (paymentRequest.getTransactionReference() != null) {
            payment.setTransactionReference(paymentRequest.getTransactionReference());
        }

        if (paymentRequest.getStatus() != null) {
            payment.setStatus(paymentRequest.getStatus());
        }

        Payments updatedPayment = paymentRepository.save(payment);
        log.info("Payment updated successfully with ID: {}", updatedPayment.getPaymentId());

        return updatedPayment;
    }

    @Override
    public void deletePayment(Long paymentId) {
        log.info("Deleting payment with ID: {}", paymentId);

        if (!paymentRepository.existsById(paymentId)) {
            log.error("Payment not found with ID: {}", paymentId);
            throw new RuntimeException("Payment not found with ID: " + paymentId);
        }

        paymentRepository.deleteById(paymentId);
        log.info("Payment deleted successfully with ID: {}", paymentId);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalPaymentForService(Long serviceId) {
        log.info("Calculating total payment for service ID: {}", serviceId);

        if (!serviceRepository.existsById(serviceId)) {
            log.error("Service not found with ID: {}", serviceId);
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        List<Payments> payments = paymentRepository.findByServiceId(serviceId);
        return payments.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .map(Payments::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalPaymentByClient(Long clientId) {
        log.info("Calculating total payment by client ID: {}", clientId);

        if (!clientRepository.existsById(clientId)) {
            log.error("Client not found with ID: {}", clientId);
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        List<Payments> payments = paymentRepository.findByClientId(clientId);
        return payments.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .map(Payments::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPaymentsByService(Long serviceId) {
        log.info("Counting payments for service ID: {}", serviceId);

        if (!serviceRepository.existsById(serviceId)) {
            log.error("Service not found with ID: {}", serviceId);
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        return paymentRepository.countByServiceId(serviceId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPaymentsByClient(Long clientId) {
        log.info("Counting payments for client ID: {}", clientId);

        if (!clientRepository.existsById(clientId)) {
            log.error("Client not found with ID: {}", clientId);
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        return paymentRepository.countByClientId(clientId);
    }
}
