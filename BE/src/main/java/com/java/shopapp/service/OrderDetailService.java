package com.java.shopapp.service;

import com.java.shopapp.dto.response.OrderDetailResponse;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetailResponse> getOrderDetail(Long orderId);
}
