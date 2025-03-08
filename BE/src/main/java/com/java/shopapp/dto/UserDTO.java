package com.java.shopapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class UserDTO {
    private String id;
    private String username;
    private String password;
    private String fullName;
    private String address;
    private boolean active;
    private Date dateOfBirth;
    private int googleAccountId;
    private String phoneNumber;
}
