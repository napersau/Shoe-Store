package com.java.shopapp.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserCreateRequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    private String username;
    @Size(min = 6, message = "PASSWORD_INVALID" )
    private String password;
    private String fullName;
    private String phoneNumber;
}
