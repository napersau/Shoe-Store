package com.java.shopapp.controller;


import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.request.CartDetailRequest;
import com.java.shopapp.dto.response.CartDetailResponse;
import com.java.shopapp.service.CartDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart-detail")
@RequiredArgsConstructor
public class CartDetailController {

    private final CartDetailService cartDetailService;

    @PostMapping
    ApiResponse<CartDetailResponse> createCartDetail(@RequestBody @Valid CartDetailRequest cartDetailRequest) {
        ApiResponse<CartDetailResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(cartDetailService.createCartDetail(cartDetailRequest));
        return apiResponse;
    }

    @PutMapping("/{id}")
    ApiResponse<CartDetailResponse> updateCartDetail(@PathVariable Long id, @RequestBody @Valid CartDetailRequest cartDetailRequest) {
        ApiResponse<CartDetailResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(cartDetailService.updateCartDetail(id, cartDetailRequest));
        return apiResponse;
    }

    @DeleteMapping("/{id}")
    ApiResponse<CartDetailResponse> deleteCartDetail(@PathVariable Long id) {
        ApiResponse<CartDetailResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(cartDetailService.deleteCartDetail(id));
        return apiResponse;
    }

    @GetMapping
    ApiResponse<List<CartDetailResponse>> getAllCartDetails() {
        return ApiResponse.<List<CartDetailResponse>>builder()
                .code(1000)
                .result(cartDetailService.getAllCartDetails())
                .build();
    }

}
