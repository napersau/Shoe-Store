package com.java.shopapp.controller;

import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.request.ForgotPasswordRequest;
import com.java.shopapp.dto.request.MailRequest;
import com.java.shopapp.service.EmailService;
import com.java.shopapp.service.PasswordResetService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/order")
    public ApiResponse<String> sendEmail(@RequestBody MailRequest mailRequest) throws MessagingException {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        emailService.sendSimpleMessage(mailRequest);
        apiResponse.setResult("Gửi mail thành công");
        return apiResponse;
    }

    // API gửi OTP để reset password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendPasswordResetOtp(request);

            ApiResponse<String> response = new ApiResponse<>();
            response.setResult("OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            boolean isValid = passwordResetService.verifyOtp(request);

            ApiResponse<String> response = new ApiResponse<>();
            if (isValid) {
                response.setResult("OTP hợp lệ. Bạn có thể đặt lại mật khẩu.");
            } else {
                response.setMessage("OTP không hợp lệ hoặc đã hết hạn");
                return ResponseEntity.badRequest().body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API reset password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request);

            ApiResponse<String> response = new ApiResponse<>();
            response.setResult("Mật khẩu đã được đặt lại thành công.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
