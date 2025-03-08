package com.java.shopapp.dto.response;


import com.java.shopapp.entity.Category;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long id;

    private String name;

    private double price;

    private String image;

    private String description;

    private String brand;

    private String color;

    private Category category;
}
