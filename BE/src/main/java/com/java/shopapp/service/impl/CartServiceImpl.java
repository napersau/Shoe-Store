package com.java.shopapp.service.impl;

import com.java.shopapp.dto.response.CartDetailResponse;
import com.java.shopapp.dto.response.CartResponse;
import com.java.shopapp.entity.Cart;
import com.java.shopapp.entity.CartDetail;
import com.java.shopapp.entity.User;
import com.java.shopapp.exception.AppException;
import com.java.shopapp.exception.ErrorCode;
import com.java.shopapp.repository.CartDetailRepository;
import com.java.shopapp.repository.CartRepository;
import com.java.shopapp.repository.UserRepository;
import com.java.shopapp.service.CartDetailService;
import com.java.shopapp.service.CartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Override
    public void updateToltalMoneyCart(Cart cart) {
        List<CartDetail> cartDetails = cartDetailRepository.getCartDetailsByCartId(cart.getId());
        Double totalMoney = 0D;
        for (CartDetail cartDetail : cartDetails) {
            Double totalMoneyTemp = cartDetail.getTotalMoney();
            totalMoney = totalMoney + totalMoneyTemp;
        }
        cart.setTotalMoney(totalMoney);
        cartRepository.save(cart);
    }

    @Override
    public CartResponse getCart() {
        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));
        Cart cart = user.getCart();
        CartResponse cartResponse = new CartResponse();
        cartResponse.setTotalMoney(cart.getTotalMoney());
        return cartResponse;
    }

    @Override
    public CartResponse deleteCart() {

        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));

        // Setup lại giỏ hàng cho tổng tiền = 0
        Cart cart = user.getCart();
        cart.setTotalMoney(0D);

        // Xóa hết các chi tiết giỏ hàng
        cartDetailRepository.deleteByCartId(cart.getId());


        return modelMapper.map(cartRepository.save(cart), CartResponse.class);
    }

}
