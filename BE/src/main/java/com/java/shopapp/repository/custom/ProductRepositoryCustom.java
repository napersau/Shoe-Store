package com.java.shopapp.repository.custom;

import com.java.shopapp.builder.ProductSearchBuilder;
import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.response.ProductResponse;
import com.java.shopapp.entity.Product;

import java.util.List;

public interface ProductRepositoryCustom {
    List<Product> findAllProducts(ProductSearchBuilder productSearchBuilder);
}
