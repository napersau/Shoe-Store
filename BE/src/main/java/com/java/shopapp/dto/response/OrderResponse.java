package com.java.shopapp.dto.response;

import com.java.shopapp.entity.OrderDetail;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderResponse {

    private Long id;

    private Long userId;


    private String fullName;


    private String email;


    private String address;


    private String note;


    private Date orderDate;


    private String status;


    private Double totalMoney;


    private String paymentMethod;


    private String paymentStatus;
}
