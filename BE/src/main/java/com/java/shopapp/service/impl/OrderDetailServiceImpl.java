package com.java.shopapp.service.impl;

import com.java.shopapp.dto.response.OrderDetailResponse;
import com.java.shopapp.entity.OrderDetail;
import com.java.shopapp.repository.OrderDetailRepository;
import com.java.shopapp.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {

    private final ModelMapper modelMapper;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetailResponse> getOrderDetail(Long orderId) {
        List<OrderDetail> orderDetailResponses = orderDetailRepository.findByOrderId(orderId);

        return orderDetailResponses
                .stream()
                .map(orderDetail -> modelMapper.map(orderDetail, OrderDetailResponse.class))
                .toList();
    }
}
