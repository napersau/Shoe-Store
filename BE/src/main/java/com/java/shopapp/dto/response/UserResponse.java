package com.java.shopapp.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;


@Getter
@Setter
public class UserResponse {
    private String id;
    private String username;
    private String password;
    private String fullName;
    private String address;
    private boolean active;
    private Date dateOfBirth;
    private int googleAccountId;
    private String phoneNumber;
    private Long cartId;
}
