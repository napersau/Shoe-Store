package com.java.shopapp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProductRequest {

    private String name;

    private double price;

    private String image;
    private String imageBase64;
    private String imageName;

    private String description;

    private String brand;

    private String color;

    private Long category_id;
}
