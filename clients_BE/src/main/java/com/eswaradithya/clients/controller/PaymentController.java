package com.eswaradithya.clients.controller;

import com.eswaradithya.clients.entity.Payments;
import com.eswaradithya.clients.models.PaymentRequestDTO;
import com.eswaradithya.clients.models.PaymentResponseDTO;
import com.eswaradithya.clients.service.PaymentService;
import com.eswaradithya.clients.utils.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * PaymentController
 * REST API endpoints for payment management
 * Handles CRUD operations and payment queries
 */
@RestController
@RequestMapping("/eswaradithya/payments")
@Slf4j
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Create a new payment
     * POST /eswaradithya/payments/save
     * 
     * @param paymentRequest Payment data
     * @return Created payment response
     */
    @PostMapping("/save")
    public ResponseEntity<APIResponse<PaymentResponseDTO>> createPayment(
            @RequestBody PaymentRequestDTO paymentRequest) {
        try {
            log.info("Creating new payment for service: {} and client: {}", 
                    paymentRequest.getServiceId(), paymentRequest.getClientId());

            Payments payment = paymentService.createPayment(paymentRequest);
            PaymentResponseDTO response = PaymentResponseDTO.from(payment);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(APIResponse.success(2001, "Payment created successfully", response));

        } catch (RuntimeException ex) {
            log.error("Error creating payment: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(APIResponse.error(4001, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error creating payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Get payment by ID
     * GET /eswaradithya/payments/{id}
     * 
     * @param paymentId Payment ID
     * @return Payment details
     */
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<PaymentResponseDTO>> getPaymentById(
            @PathVariable("id") Long paymentId) {
        try {
            log.info("Fetching payment with ID: {}", paymentId);

            Payments payment = paymentService.getPaymentById(paymentId);
            PaymentResponseDTO response = PaymentResponseDTO.from(payment);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Payment retrieved successfully", response));

        } catch (RuntimeException ex) {
            log.error("Error fetching payment: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(APIResponse.error(4004, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error fetching payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Get all payments for a service
     * GET /eswaradithya/payments/service/{serviceId}
     * 
     * @param serviceId Service ID
     * @param page Page number (optional, default: 0)
     * @param size Page size (optional, default: 10)
     * @return List of payments
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<APIResponse<List<PaymentResponseDTO>>> getPaymentsByService(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Fetching payments for service ID: {}, page: {}, size: {}", serviceId, page, size);

            Pageable pageable = PageRequest.of(page, size);
            Page<Payments> paymentsPage = paymentService.getPaymentsByService(serviceId, pageable);

            List<PaymentResponseDTO> response = paymentsPage.getContent().stream()
                    .map(PaymentResponseDTO::from)
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Payments retrieved successfully", response));

        } catch (RuntimeException ex) {
            log.error("Error fetching payments for service: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(APIResponse.error(4004, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error fetching payments: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Get all payments by a client
     * GET /eswaradithya/payments/client/{clientId}
     * 
     * @param clientId Client ID
     * @param page Page number (optional, default: 0)
     * @param size Page size (optional, default: 10)
     * @return List of payments
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<APIResponse<List<PaymentResponseDTO>>> getPaymentsByClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Fetching payments for client ID: {}, page: {}, size: {}", clientId, page, size);

            Pageable pageable = PageRequest.of(page, size);
            Page<Payments> paymentsPage = paymentService.getPaymentsByClient(clientId, pageable);

            List<PaymentResponseDTO> response = paymentsPage.getContent().stream()
                    .map(PaymentResponseDTO::from)
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Payments retrieved successfully", response));

        } catch (RuntimeException ex) {
            log.error("Error fetching payments for client: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(APIResponse.error(4004, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error fetching payments: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Update a payment
     * PUT /eswaradithya/payments/{id}
     * 
     * @param paymentId Payment ID to update
     * @param paymentRequest Updated payment data
     * @return Updated payment response
     */
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<PaymentResponseDTO>> updatePayment(
            @PathVariable("id") Long paymentId,
            @RequestBody PaymentRequestDTO paymentRequest) {
        try {
            log.info("Updating payment with ID: {}", paymentId);

            Payments payment = paymentService.updatePayment(paymentId, paymentRequest);
            PaymentResponseDTO response = PaymentResponseDTO.from(payment);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Payment updated successfully", response));

        } catch (RuntimeException ex) {
            log.error("Error updating payment: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(APIResponse.error(4001, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error updating payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Delete a payment
     * DELETE /eswaradithya/payments/{id}
     * 
     * @param paymentId Payment ID to delete
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deletePayment(
            @PathVariable("id") Long paymentId) {
        try {
            log.info("Deleting payment with ID: {}", paymentId);

            paymentService.deletePayment(paymentId);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Payment deleted successfully", null));

        } catch (RuntimeException ex) {
            log.error("Error deleting payment: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(APIResponse.error(4004, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error deleting payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Get total payment amount for a service
     * GET /eswaradithya/payments/total/service/{serviceId}
     * 
     * @param serviceId Service ID
     * @return Total payment amount
     */
    @GetMapping("/total/service/{serviceId}")
    public ResponseEntity<APIResponse<java.math.BigDecimal>> getTotalPaymentForService(
            @PathVariable Long serviceId) {
        try {
            log.info("Calculating total payment for service ID: {}", serviceId);

            java.math.BigDecimal total = paymentService.getTotalPaymentForService(serviceId);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Total payment calculated successfully", total));

        } catch (RuntimeException ex) {
            log.error("Error calculating total payment: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(APIResponse.error(4004, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error calculating total payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

    /**
     * Get total payment amount by a client
     * GET /eswaradithya/payments/total/client/{clientId}
     * 
     * @param clientId Client ID
     * @return Total payment amount
     */
    @GetMapping("/total/client/{clientId}")
    public ResponseEntity<APIResponse<java.math.BigDecimal>> getTotalPaymentByClient(
            @PathVariable Long clientId) {
        try {
            log.info("Calculating total payment by client ID: {}", clientId);

            java.math.BigDecimal total = paymentService.getTotalPaymentByClient(clientId);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(APIResponse.success(2000, "Total payment calculated successfully", total));

        } catch (RuntimeException ex) {
            log.error("Error calculating total payment: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(APIResponse.error(4004, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Unexpected error calculating total payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error(5001, "Something went wrong"));
        }
    }

}