package com.java.shopapp.repository.custom.impl;

import com.java.shopapp.builder.ProductSearchBuilder;
import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.response.ProductResponse;
import com.java.shopapp.entity.Product;
import com.java.shopapp.repository.custom.ProductRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Field;
import java.util.List;

@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public static void queryNormal(ProductSearchBuilder productSearchBuilder, StringBuilder where) {
        try {
            Field[] fields = ProductSearchBuilder.class.getDeclaredFields();
            for(Field item : fields) {
                item.setAccessible(true);
                String fieldName = item.getName();
                if(!fieldName.startsWith("price") && !fieldName.equals("sortBy")) {
                    Object value = item.get(productSearchBuilder);
                    if(value != null) {
                        if(item.getType().getName().equals("java.lang.Double") || item.getType().getName().equals("java.lang.Long")) {
                            where.append(" AND p." + fieldName + " = " + value + " ");
                        }
                        else if(item.getType().getName().equals("java.lang.String") && !((String) value).isEmpty()){
                            where.append(" AND p." + fieldName + " like '%" + value + "%' ");
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void querySpecial(ProductSearchBuilder productSearchBuilder, StringBuilder where) {
        Double priceFrom = productSearchBuilder.getPriceFrom();
        Double priceTo = productSearchBuilder.getPriceTo();

        if (priceFrom != null) {
            where.append(" AND p.price >= " + priceFrom + " ");
        }
        if (priceTo != null) {
            where.append(" AND p.price <= " + priceTo + " ");
        }

        if(productSearchBuilder.getSortBy() != null && !productSearchBuilder.getSortBy().isEmpty()) {
            if(productSearchBuilder.getSortBy().equals("price ASC")) {
                where.append(" ORDER BY p." + productSearchBuilder.getSortBy() + " ");
            }
            else if(productSearchBuilder.getSortBy().equals("price DESC")) {
                where.append(" ORDER BY p." + productSearchBuilder.getSortBy() + " ");
            }
        }
        else{
            where.append(" ORDER BY p.id ");
        }

    }

    @Override
    public List<Product> findAllProducts(ProductSearchBuilder productSearchBuilder) {
        StringBuilder sql = new StringBuilder("SELECT p.* FROM products p ");
        StringBuilder where = new StringBuilder(" WHERE 1 = 1 ");
        queryNormal(productSearchBuilder, where);
        querySpecial(productSearchBuilder, where);
        sql.append(where);
        Query query = entityManager.createNativeQuery(sql.toString(), Product.class);
        return query.getResultList();
    }
}
