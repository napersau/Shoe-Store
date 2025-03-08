package com.java.shopapp.service.impl;


import com.java.shopapp.builder.ProductSearchBuilder;
import com.java.shopapp.builder.ProductSearchBuilderConverter;
import com.java.shopapp.dto.request.ProductRequest;
import com.java.shopapp.dto.request.ProductSearchRequest;
import com.java.shopapp.dto.response.ProductResponse;
import com.java.shopapp.entity.Category;
import com.java.shopapp.entity.Product;
import com.java.shopapp.exception.AppException;
import com.java.shopapp.exception.ErrorCode;
import com.java.shopapp.repository.CategoryRepository;
import com.java.shopapp.repository.ProductRepository;
import com.java.shopapp.service.ProductService;
import com.java.shopapp.utils.UploadFileUtils;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.File;
import java.util.Arrays;
import java.util.List;

import java.util.stream.Collectors;




@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductSearchBuilderConverter productSearchBuilderConverter;

    private final UploadFileUtils uploadFileUtils;



    @Override
    public ProductResponse createProduct(ProductRequest productRequest) {

        if(productRepository.existsByName(productRequest.getName())) {
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }
        Category category = categoryRepository.findById(productRequest.getCategory_id()).get();
        Product product = modelMapper.map(productRequest, Product.class);
        product.setCategory(category);

        saveThumbnail(productRequest, product);
        return modelMapper.map(productRepository.save(product), ProductResponse.class);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> modelMapper.map(product, ProductResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product Not Found"));

        if(productRepository.existsByName(productRequest.getName())) {
            if(productRequest.getName().equals(product.getName())) {
                System.out.println("");
            }
            else throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }
        modelMapper.map(productRequest, product);
        product.setId(product.getId());
        saveThumbnail(productRequest, product);
        productRepository.save(product);
        ProductResponse productResponse = modelMapper.map(product, ProductResponse.class);
        productResponse.setId(id);
        return productResponse;
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product Not Found"));
        modelMapper.map(product, ProductResponse.class);
        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public List<ProductResponse> findAllProducts(ProductSearchRequest productSearchRequest) {
        ProductSearchBuilder productSearchBuilder = productSearchBuilderConverter.toProductSearchBuider(productSearchRequest);
        List<Product> productEntities = productRepository.findAllProducts(productSearchBuilder);
        return productEntities.stream().map(pr -> modelMapper.map(pr, ProductResponse.class)).collect(Collectors.toList());
    }

    private void saveThumbnail(ProductRequest productRequest, Product product)
    {
        String path = "/products/" + productRequest.getImageName();
        if (null != productRequest.getImageBase64())
        {
            if (null != product.getImage())
            {
                if (!path.equals(product.getImage()))
                {

                    File file = new File("C://Users/84334/Desktop/react/example-webapp/public/products" + product.getImage());
                    file.delete();
                }
            }
            byte[] bytes = Base64.decodeBase64(productRequest.getImageBase64());

            uploadFileUtils.writeOrUpdate(path, bytes);
            product.setImage(path);
        }
    }



}
