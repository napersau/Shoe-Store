package com.java.shopapp.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class OrderDetailResponse {

    private Long id;

    private Long orderId;

    private Long productId;

    private Double price;

    private Double totalMoney;

    private Integer numberOfProducts;

    private String color;
}
