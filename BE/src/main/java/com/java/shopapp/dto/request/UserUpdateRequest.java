package com.java.shopapp.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class UserUpdateRequest {
    private String fullName;
    private String address;
    private String phoneNumber;
    private Date dateOfBirth;
    private String oldPassword;
    private String newPassword;
}
