package com.java.shopapp.controller;


import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.request.OrderRequest;
import com.java.shopapp.dto.request.OrderUpdateRequest;
import com.java.shopapp.dto.response.OrderResponse;
import com.java.shopapp.service.OrderService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    // Đặt hàng bằng giỏ hàng
    @PostMapping
    ApiResponse<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.createOrder(orderRequest));
        return apiResponse;
    }

    // Đặt hàng bằng mua trực tiếp
    @PostMapping("/{id}")
    ApiResponse<OrderResponse> createOrderbyId(@PathVariable Long id, @RequestBody OrderRequest orderRequest) {
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.createOrderById(id, orderRequest));
        return apiResponse;
    }


    @PutMapping
    ApiResponse<OrderResponse> updateOrder(@RequestBody OrderUpdateRequest orderUpdateRequest) {
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.updateOrder(orderUpdateRequest));
        return apiResponse;
    }

    // Trang của khách
    @GetMapping
    ApiResponse<List<OrderResponse>> getAllOrders() {
        ApiResponse<List<OrderResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.getAllOrders());
        return apiResponse;
    }

    @GetMapping("/filter")
    ApiResponse<List<OrderResponse>> getOrderAndFilter(@RequestParam String status) {
        ApiResponse<List<OrderResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.getOrderAndFilter(status));
        return apiResponse;
    }


    // Trang của AD
    @GetMapping("/manager")
    ApiResponse<List<OrderResponse>> getAllOrdersManager() {
        ApiResponse<List<OrderResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.getAllOrdersByAdmin());
        return apiResponse;
    }

    // Lọc đơn hàng Admin
    @GetMapping("/manager/filter")
    ApiResponse<List<OrderResponse>> getAllOrdersByManager(@RequestParam String status) {
        ApiResponse<List<OrderResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(orderService.getOrdersByStatus(status));
        return apiResponse;
    }

}
