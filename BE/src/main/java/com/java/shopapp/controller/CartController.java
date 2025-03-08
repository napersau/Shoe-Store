package com.java.shopapp.controller;


import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.response.CartDetailResponse;
import com.java.shopapp.dto.response.CartResponse;
import com.java.shopapp.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    ApiResponse<CartResponse> getCart() {
        ApiResponse<CartResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(cartService.getCart());
        return apiResponse;
    }

    @DeleteMapping
    ApiResponse<CartResponse> deleteCart() {
        ApiResponse<CartResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(cartService.deleteCart());
        return apiResponse;
    }

}
