package com.java.shopapp.service;


import com.java.shopapp.dto.request.ForgotPasswordRequest;
import org.springframework.stereotype.Service;


public interface PasswordResetService {
    void sendPasswordResetOtp(ForgotPasswordRequest request);
    boolean verifyOtp(ForgotPasswordRequest request);
    void resetPassword(ForgotPasswordRequest request);
}
