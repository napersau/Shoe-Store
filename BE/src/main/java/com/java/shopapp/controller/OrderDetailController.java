package com.java.shopapp.controller;


import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.request.OrderDetailRequest;
import com.java.shopapp.dto.response.OrderDetailResponse;
import com.java.shopapp.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order-details")
@RequiredArgsConstructor
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    @GetMapping("/{orderId}")
    ApiResponse<List<OrderDetailResponse>> getOrderDetail(@PathVariable Long orderId) {
        ApiResponse<List<OrderDetailResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderDetailService.getOrderDetail(orderId));
        return apiResponse;
    }


}
