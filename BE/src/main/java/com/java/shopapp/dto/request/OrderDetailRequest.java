package com.java.shopapp.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class OrderDetailRequest {
    private Long orderId;

    private Long productId;

    private Double price;

    private Double totalMoney;

    private Integer numberOfProducts;

    private String color;
}
