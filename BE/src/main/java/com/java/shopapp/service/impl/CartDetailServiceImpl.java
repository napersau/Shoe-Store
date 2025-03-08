package com.java.shopapp.service.impl;

import com.java.shopapp.dto.request.CartDetailRequest;
import com.java.shopapp.dto.response.CartDetailResponse;
import com.java.shopapp.entity.Cart;
import com.java.shopapp.entity.CartDetail;
import com.java.shopapp.entity.Product;
import com.java.shopapp.entity.User;
import com.java.shopapp.exception.AppException;
import com.java.shopapp.exception.ErrorCode;
import com.java.shopapp.repository.CartDetailRepository;
import com.java.shopapp.repository.CartRepository;
import com.java.shopapp.repository.ProductRepository;
import com.java.shopapp.repository.UserRepository;
import com.java.shopapp.service.CartDetailService;
import com.java.shopapp.service.CartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartDetailServiceImpl implements CartDetailService{

    private final CartDetailRepository cartDetailRepository;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final UserRepository userRepository;


    @Override
    public CartDetailResponse createCartDetail(CartDetailRequest cartDetailRequest) {

        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));

        CartDetail cartDetail = new CartDetail();
        Product product = productRepository.findById(cartDetailRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product Not Found"));
        cartDetail.setTotalMoney(cartDetailRequest.getTotalMoney());
        cartDetail.setProduct(product);
        cartDetail.setNumberOfProducts(cartDetailRequest.getNumberOfProducts());
        cartDetail.setCart(user.getCart());
        cartDetail.setSize(cartDetailRequest.getSize());

        CartDetailResponse cartDetailResponse = modelMapper.map(cartDetailRepository.save(cartDetail), CartDetailResponse.class);
        cartService.updateToltalMoneyCart(user.getCart());

        return cartDetailResponse;
    }

    @Override
    public CartDetailResponse deleteCartDetail(Long id) {
        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));

        CartDetail cartDetail = cartDetailRepository.findById(id).get();
        cartDetailRepository.delete(cartDetail);

        cartService.updateToltalMoneyCart(user.getCart());
        return modelMapper.map(cartDetail, CartDetailResponse.class);
    }

    @Override
    public List<CartDetailResponse> getAllCartDetails() {
        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return cartDetailRepository.getCartDetailsByCartId(user.getCart().getId())
                .stream()
                .map(cartDetail -> modelMapper.map(cartDetail, CartDetailResponse.class))
                .collect(Collectors.toList());
    }

}
