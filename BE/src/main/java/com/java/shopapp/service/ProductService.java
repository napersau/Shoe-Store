package com.java.shopapp.service;

import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.request.ProductSearchRequest;
import com.java.shopapp.dto.response.ProductResponse;
import org.aspectj.weaver.ast.Var;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ProductService {
    ProductResponse createProduct(ProductRequest productRequest);
    List<ProductResponse> getAllProducts();
    ProductResponse updateProduct(Long id, ProductRequest productRequest);
    void deleteProduct(Long id);
    ProductResponse getProduct(Long id);
    Page<ProductResponse> findAllProducts(ProductSearchRequest productSearchRequest, int page, int size);
    long countTotalProducts(ProductSearchRequest productSearchRequest);

}
