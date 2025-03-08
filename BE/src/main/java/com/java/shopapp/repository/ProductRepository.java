package com.java.shopapp.repository;

import com.java.shopapp.entity.Product;
import com.java.shopapp.repository.custom.ProductRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProductRepository extends JpaRepository<Product, Long> , ProductRepositoryCustom {
    boolean existsByName(String name);
}
