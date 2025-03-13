package com.java.shopapp.controller;


import com.java.shopapp.dto.ApiResponse;
import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.request.ProductSearchRequest;
import com.java.shopapp.dto.response.ProductResponse;
import com.java.shopapp.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;




    @PostMapping
    ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductRequest productRequest) {
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.createProduct(productRequest));
        return apiResponse;
    }

    @GetMapping
    ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .code(1000)
                .result(productService.getAllProducts())
                .build();
    }

    @PutMapping("/{productId}")
    ApiResponse<ProductResponse> updateProduct(@PathVariable("productId") Long id,@RequestBody @Valid ProductRequest productRequest) {
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.updateProduct(id, productRequest));
        return apiResponse;
    }

    @DeleteMapping("/{productId}")
    ApiResponse<ProductResponse> deleteProduct(@PathVariable Long productId) {
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        productService.deleteProduct(productId);
        apiResponse.setMessage("Product deleted successfully");
        return apiResponse;
    }

    @GetMapping("/{productId}")
    ApiResponse<ProductResponse> getProduct(@PathVariable Long productId) {
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.getProduct(productId));
        return apiResponse;
    }

    @GetMapping("/client")
    ApiResponse<List<ProductResponse>> getProductsForClient() {
        return ApiResponse.<List<ProductResponse>>builder()
                .code(1000)
                .result(productService.getAllProducts())
                .build();
    }

    @GetMapping("/client/{productId}")
    ApiResponse<ProductResponse> getProductForClient(@PathVariable Long productId) {
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.getProduct(productId));
        return apiResponse;
    }

    @GetMapping("/product-list")
    ApiResponse<List<ProductResponse>> getAllProductsForClient(@RequestParam Map<String, Object> params) {
        ProductSearchRequest productSearchRequest = new ProductSearchRequest();

        productSearchRequest.setName(params.get("name") == null ? "" : params.get("name").toString());
        productSearchRequest.setBrand(params.get("brand") == null ? "" : params.get("brand").toString());
        productSearchRequest.setColor(params.get("color") == null ? "" : params.get("color").toString());
        productSearchRequest.setSortBy(params.get("sortBy") == null ? "" : params.get("sortBy").toString());
        if (params.get("priceFrom") != null) {
            productSearchRequest.setPriceFrom(Double.parseDouble(params.get("priceFrom").toString()));
        }
        if (params.get("priceTo") != null) {
            productSearchRequest.setPriceTo(Double.parseDouble(params.get("priceTo").toString()));
        }
        if (params.get("category_id") != null) {
            productSearchRequest.setCategory_id(Long.parseLong(params.get("category_id").toString()));
        }
        ApiResponse<List<ProductResponse>> apiResponse = new ApiResponse<>();

        List<ProductResponse> productResponseList = productService.findAllProducts(productSearchRequest);


        apiResponse.setResult(productResponseList);
        return apiResponse;
    }


}
