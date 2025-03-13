package com.java.shopapp.config;

import org.springframework.beans.factory.annotation.Value;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.stream.Collectors;

public class VnpayConfig {

    @Value("${vnpay.vnp-url}")
    private String vnp_PayUrl;


    @Value("${vnpay.vnp-return-url}")
    private String vnp_Returnurl;

    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash-secret}")
    private static String vnp_HashSecret;


    public static String vnp_apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";


    private static final String SECRET_KEY = "your-secret-key"; // Key bảo mật từ VNPAY

    public static String hashAllFields(Map<String, String> fields) {
        String data = fields.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));

        return hmacSHA512(SECRET_KEY, data);
    }

    private static String hmacSHA512(String key, String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(key.getBytes(StandardCharsets.UTF_8));
            byte[] bytes = md.digest(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte aByte : bytes) {
                sb.append(String.format("%02x", aByte));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing data", e);
        }
    }


}
