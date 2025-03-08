package com.java.shopapp.dto.response;


import com.java.shopapp.entity.Cart;
import com.java.shopapp.entity.Product;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartDetailResponse {
    private Long id;

    private Cart cart;

    private Product product;

    private Double size;

    private Integer numberOfProducts;

    private Double totalMoney;
}
