package com.java.shopapp.service.impl;

import com.java.shopapp.dto.request.OrderRequest;
import com.java.shopapp.dto.request.OrderUpdateRequest;
import com.java.shopapp.dto.response.OrderResponse;
import com.java.shopapp.entity.*;
import com.java.shopapp.exception.AppException;
import com.java.shopapp.exception.ErrorCode;
import com.java.shopapp.repository.*;
import com.java.shopapp.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final ModelMapper modelMapper;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ProductRepository productRepository;

    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {

        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));



        Order order = Order.builder()
                .user(user)
                .fullName(orderRequest.getFullName())
                .email(orderRequest.getEmail())
                .address(orderRequest.getAddress())
                .note(orderRequest.getNote())
                .totalMoney(orderRequest.getTotalMoney())
                .paymentMethod(orderRequest.getPaymentMethod())
                .paymentStatus(orderRequest.getPaymentStatus())
                .orderDate(new Date())
                .status("Người bán đang chuẩn bị hàng.")
                .build();

        // Ds chi tiết đơn hàng
        List<CartDetail> cartDetails = cartDetailRepository.getCartDetailsByCartId(user.getCart().getId());
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (CartDetail cartDetail : cartDetails) {
            OrderDetail orderDetail = OrderDetail.builder()
                    .product(cartDetail.getProduct())
                    .totalMoney(cartDetail.getTotalMoney())
                    .numberOfProducts(cartDetail.getNumberOfProducts())
                    .size(cartDetail.getSize())
                    .build();
            orderDetails.add(orderDetail);
        }
        order.setOrderDetails(orderDetails);

        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("Người bán đang chuẩn bị hàng");
        for (OrderDetail orderDetail : orderDetails) {
            orderDetail.setOrder(order);
        }
        orderRepository.save(order);



        return modelMapper.map(order, OrderResponse.class);
    }

    @Override
    public OrderResponse updateOrder(OrderUpdateRequest orderUpdateRequest) {
        Order order = orderRepository.findById(orderUpdateRequest.getId()).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(orderUpdateRequest.getStatus());
        order.setPaymentStatus(orderUpdateRequest.getPaymentStatus());
        return modelMapper.map(orderRepository.save(order), OrderResponse.class);
    }



    @Override
    public List<OrderResponse> getAllOrders() {


        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));


        return orderRepository.getOrdersByUserId(user.getId())
                .stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());

    }

    @Override
    public List<OrderResponse> getOrderAndFilter(String status) {

        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Order> orders = orderRepository.getOrdersByStatusAndUserId(status, user.getId());


        return orders
                .stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());
    }



    @Override
    public List<OrderResponse> getAllOrdersByAdmin() {
        return orderRepository.findAll()
                .stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse createOrderById(Long id, OrderRequest orderRequest) {

        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));


        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        OrderDetail orderDetail = OrderDetail.builder()
                .product(product)
                .totalMoney(orderRequest.getTotalMoney())
                .numberOfProducts(orderRequest.getNumberOfProducts())
                .size(orderRequest.getSize())
                .build();


        Order order = Order.builder()
                .orderDetails(Collections.singletonList(orderDetail))
                .user(user)
                .fullName(orderRequest.getFullName())
                .email(orderRequest.getEmail())
                .address(orderRequest.getAddress())
                .note(orderRequest.getNote())
                .totalMoney(orderRequest.getTotalMoney())
                .paymentMethod(orderRequest.getPaymentMethod())
                .paymentStatus(orderRequest.getPaymentStatus())
                .orderDate(new Date())
                .status("Người bán đang chuẩn bị hàng")
                .build();

        orderDetail.setOrder(order);

        return modelMapper.map(orderRepository.save(order), OrderResponse.class);
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(String status) {

        List<Order> orders = orderRepository.getOrdersByStatus(status);

        return orders
                .stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());

    }

    @Override
    public void deleteOrderById(Long id) {
        orderDetailRepository.deleteByOrderId(id);
        orderRepository.deleteById(id);
    }

    @Override
    public void updateOrderPaymentStatusById(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPaymentStatus(status);
        orderRepository.save(order);
    }


}
