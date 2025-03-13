package com.java.shopapp.controller;

import com.java.shopapp.config.VnpayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class VnpayReturnController {

//    @GetMapping("/vnpay/return")
//    public String handleVnpayReturn(HttpServletRequest request, Model model) {
//        // Lấy tất cả tham số từ request
//        Map<String, String> fields = new HashMap<>();
//        request.getParameterMap().forEach((key, values) -> {
//            if (values.length > 0) {
//                fields.put(key, values[0]);
//            }
//        });
//
//        // Lấy SecureHash từ request
//        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
//        fields.remove("vnp_SecureHash");
//        fields.remove("vnp_SecureHashType");
//
//        // Kiểm tra chữ ký bảo mật (SecureHash)
//        String signValue = VnpayConfig.hashAllFields(fields);
//        boolean isValidSignature = signValue.equals(vnp_SecureHash);
//
//        // Kiểm tra trạng thái giao dịch
//        boolean isSuccess = "00".equals(request.getParameter("vnp_ResponseCode"));
//
//        // Truyền dữ liệu qua View (HTML)
//        model.addAttribute("isValidSignature", isValidSignature);
//        model.addAttribute("isSuccess", isSuccess);
//        return "vnpay_return"; // Trả về trang JSP hoặc Thymeleaf
//    }
}
