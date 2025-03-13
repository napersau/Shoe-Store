package com.java.shopapp.controller;

import com.java.shopapp.config.VnpayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api/vnpay")
public class VnpayIpnController {

//    @GetMapping("/ipn")
//    public Map<String, String> handleVnpayIpn(HttpServletRequest request) {
//        Map<String, String> response = new HashMap<>();
//
//        try {
//            // Lấy tất cả các tham số từ request
//            Map<String, String> fields = new HashMap<>();
//            request.getParameterMap().forEach((key, values) -> {
//                if (values.length > 0) {
//                    fields.put(URLEncoder.encode(key, StandardCharsets.US_ASCII),
//                            URLEncoder.encode(values[0], StandardCharsets.US_ASCII));
//                }
//            });
//
//            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
//            fields.remove("vnp_SecureHash");
//            fields.remove("vnp_SecureHashType");
//
//            // Kiểm tra tính toàn vẹn của dữ liệu bằng SecureHash
//            String signValue = VnpayConfig.hashAllFields(fields);
//            if (!signValue.equals(vnp_SecureHash)) {
//                response.put("RspCode", "97");
//                response.put("Message", "Invalid Checksum");
//                return response;
//            }
//
//            // Giả lập kiểm tra thông tin đơn hàng trong database
//            boolean checkOrderId = true;  // Kiểm tra đơn hàng có tồn tại không
//            boolean checkAmount = true;   // Kiểm tra số tiền có đúng không
//            boolean checkOrderStatus = true; // Kiểm tra trạng thái thanh toán (0: chờ xử lý)
//
//            if (!checkOrderId) {
//                response.put("RspCode", "01");
//                response.put("Message", "Order not Found");
//            } else if (!checkAmount) {
//                response.put("RspCode", "04");
//                response.put("Message", "Invalid Amount");
//            } else if (!checkOrderStatus) {
//                response.put("RspCode", "02");
//                response.put("Message", "Order already confirmed");
//            } else {
//                String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
//                if ("00".equals(vnp_ResponseCode)) {
//                    // Cập nhật trạng thái thanh toán thành công trong database
//                    response.put("RspCode", "00");
//                    response.put("Message", "Confirm Success");
//                } else {
//                    // Cập nhật trạng thái thanh toán thất bại
//                    response.put("RspCode", "02");
//                    response.put("Message", "Transaction Failed");
//                }
//            }
//        } catch (Exception e) {
//            response.put("RspCode", "99");
//            response.put("Message", "Unknown error");
//        }
//        return response;
//    }
}
