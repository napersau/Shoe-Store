package com.java.shopapp.service;

import com.java.shopapp.dto.request.CartDetailRequest;
import com.java.shopapp.dto.response.CartDetailResponse;

import java.util.List;

public interface CartDetailService {
    CartDetailResponse createCartDetail(CartDetailRequest cartDetailRequest);
    CartDetailResponse deleteCartDetail(Long id);
    List<CartDetailResponse> getAllCartDetails();
    CartDetailResponse updateCartDetail(Long id,CartDetailRequest cartDetailRequest);
}
