package com.java.shopapp.dto.request;


import lombok.*;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {
    private String name;

    private Double priceFrom;

    private Double priceTo;

    private String brand;

    private String color;

    private Long category_id;

    private String sortBy;
}
