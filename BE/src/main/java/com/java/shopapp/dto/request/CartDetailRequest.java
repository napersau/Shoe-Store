package com.java.shopapp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartDetailRequest {

    private Long productId;

    private Integer numberOfProducts;

    private Double size;

    private Double totalMoney;
}
