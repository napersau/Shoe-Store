package com.java.shopapp.repository.custom;

import com.java.shopapp.builder.ProductSearchBuilder;
import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.response.ProductResponse;
import com.java.shopapp.entity.Product;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepositoryCustom {
    List<Product> findAllProducts(ProductSearchBuilder productSearchBuilder, Pageable pageable);
    Long countAllProducts(ProductSearchBuilder productSearchBuilder);
}
