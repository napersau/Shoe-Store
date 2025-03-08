package com.java.shopapp.service;


import com.java.shopapp.dto.response.CartDetailResponse;
import com.java.shopapp.dto.response.CartResponse;
import com.java.shopapp.entity.Cart;

import java.util.List;

public interface CartService {
//    List<CartDetailResponse> getCartDetail(Long id);
    void updateToltalMoneyCart(Cart cart);
    CartResponse getCart();
    CartResponse deleteCart();
}
