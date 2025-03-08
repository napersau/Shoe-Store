package com.java.shopapp.dto.response;


import com.java.shopapp.entity.Product;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListResponse {
    private List<Product> products;
    private int totalPages;
}
