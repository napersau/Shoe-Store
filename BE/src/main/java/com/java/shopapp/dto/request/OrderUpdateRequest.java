package com.java.shopapp.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderUpdateRequest {
    private Long id;
    private String status;
    private String paymentStatus;
}
