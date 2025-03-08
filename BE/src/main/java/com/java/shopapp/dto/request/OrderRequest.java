package com.java.shopapp.dto.request;

import com.java.shopapp.entity.CartDetail;
import com.java.shopapp.entity.OrderDetail;
import com.java.shopapp.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderRequest {

    private Long id;

    private String fullName;

    private Integer numberOfProducts;

    private String email;

    private String address;

    private String note;

    private Double totalMoney;

    private String paymentMethod;

    private String paymentStatus;

    private Double Size;

}
