package com.java.shopapp.repository;


import com.java.shopapp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> getOrdersByUserId(Long userId);
    Order getOrderById(Long id);
    List<Order> getOrdersByStatus(String status);
    List<Order> getOrdersByStatusAndUserId(String status, Long userId);
}
