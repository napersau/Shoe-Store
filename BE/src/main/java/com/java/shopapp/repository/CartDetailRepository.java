package com.java.shopapp.repository;


import com.java.shopapp.dto.response.CartDetailResponse;
import com.java.shopapp.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> getCartDetailsByCartId(Long cartId);
    void deleteByCartId(Long cartId);
    CartDetail findByProductIdAndSize(Long productId, Double size);
}
