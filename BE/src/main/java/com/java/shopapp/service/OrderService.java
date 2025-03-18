package com.java.shopapp.service;

import com.java.shopapp.dto.request.OrderRequest;
import com.java.shopapp.dto.request.OrderUpdateRequest;
import com.java.shopapp.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest orderRequest);
    OrderResponse updateOrder(OrderUpdateRequest orderUpdateRequest);

    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrderAndFilter(String status);


    List<OrderResponse> getAllOrdersByAdmin();
    OrderResponse createOrderById(Long id, OrderRequest orderRequest);

    List<OrderResponse> getOrdersByStatus(String status);

    void deleteOrderById(Long id);
    void updateOrderPaymentStatusById(Long id, String status);

}
