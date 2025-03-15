package com.java.shopapp.controller;


import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.PaymentDTO;
import com.java.shopapp.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    @GetMapping("/vn-pay")
    public ApiResponse<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        ApiResponse<PaymentDTO.VNPayResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage(HttpStatus.OK.getReasonPhrase());
        apiResponse.setResult(paymentService.createVnPayPayment(request));
        return apiResponse;
    }
    @GetMapping("/vn-pay-callback")
    public ApiResponse<PaymentDTO.VNPayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        ApiResponse<PaymentDTO.VNPayResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage(HttpStatus.OK.getReasonPhrase());
        if (status.equals("00")) {
            apiResponse.setCode(HttpStatus.OK.value());
        } else {
            apiResponse.setCode(HttpStatus.BAD_REQUEST.value());
        }
        return apiResponse;
    }
}