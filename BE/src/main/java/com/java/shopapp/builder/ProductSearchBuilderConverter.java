package com.java.shopapp.builder;

import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.request.ProductSearchRequest;
import com.java.shopapp.entity.Category;
import com.java.shopapp.entity.Product;
import com.java.shopapp.utils.MapUtils;
import org.springframework.stereotype.Component;


@Component
public class ProductSearchBuilderConverter {
    public ProductSearchBuilder toProductSearchBuider(ProductSearchRequest productSearchRequest) {
        ProductSearchBuilder productSearchBuilder = ProductSearchBuilder.builder()
                .name(MapUtils.getObject(productSearchRequest.getName(), String.class))
                .priceFrom(MapUtils.getObject(productSearchRequest.getPriceFrom(), Double.class))
                .priceTo(MapUtils.getObject(productSearchRequest.getPriceTo(), Double.class))
                .brand(MapUtils.getObject(productSearchRequest.getBrand(), String.class))
                .color(MapUtils.getObject(productSearchRequest.getColor(), String.class))
                .category_id(MapUtils.getObject(productSearchRequest.getCategory_id(), Long.class))
                .sortBy(MapUtils.getObject(productSearchRequest.getSortBy(), String.class))
                .build();
        return productSearchBuilder;
    }
}
