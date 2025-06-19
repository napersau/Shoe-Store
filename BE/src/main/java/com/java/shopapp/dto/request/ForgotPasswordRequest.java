package com.java.shopapp.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {

    @Email(message = "Email không hợp lệ")
    private String email;

    private String otp;

    private String newPassword;
}