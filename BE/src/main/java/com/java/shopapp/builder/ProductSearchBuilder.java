package com.java.shopapp.builder;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchBuilder {
    private String name;

    private Double priceFrom;

    private Double priceTo;

    private String brand;

    private String color;

    private Long category_id;

    private String sortBy;
}
