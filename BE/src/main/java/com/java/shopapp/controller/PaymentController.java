package com.java.shopapp.controller;
//
//import com.nimbusds.jose.shaded.gson.JsonObject;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.UnsupportedEncodingException;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.text.SimpleDateFormat;
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/payment")
public class PaymentController {
//
//    @PostMapping("/create")
//    public ResponseEntity<JsonObject> createPayment(
//            @RequestParam("vnp_OrderInfo") String vnpOrderInfo,
//            @RequestParam("ordertype") String orderType,
//            @RequestParam("amount") int amount,
//            @RequestParam(value = "bankcode", required = false) String bankCode,
//            @RequestParam(value = "language", required = false) String language,
//            @RequestParam("txt_billing_mobile") String billingMobile,
//            @RequestParam("txt_billing_email") String billingEmail,
//            @RequestParam("txt_billing_fullname") String fullName,
//            @RequestParam("txt_inv_addr1") String billingAddress,
//            @RequestParam("txt_bill_city") String billingCity,
//            @RequestParam("txt_bill_country") String billingCountry,
//            @RequestParam(value = "txt_bill_state", required = false) String billingState,
//            @RequestParam("txt_inv_mobile") String invPhone,
//            @RequestParam("txt_inv_email") String invEmail,
//            @RequestParam("txt_inv_customer") String invCustomer,
//            @RequestParam("txt_inv_company") String invCompany,
//            @RequestParam("txt_inv_taxcode") String invTaxCode,
//            @RequestParam("cbo_inv_type") String invType,
//            HttpServletRequest request
//    ) throws UnsupportedEncodingException {
//
//        String vnpVersion = "2.1.0";
//        String vnpCommand = "pay";
//        String vnpTxnRef = VnpayConfig.getRandomNumber(8);
//        String vnpIpAddr = request.getRemoteAddr();
//        String vnpTmnCode = VnpayConfig.vnp_TmnCode;
//        int totalAmount = amount * 100;
//
//        Map<String, String> vnpParams = new HashMap<>();
//        vnpParams.put("vnp_Version", vnpVersion);
//        vnpParams.put("vnp_Command", vnpCommand);
//        vnpParams.put("vnp_TmnCode", vnpTmnCode);
//        vnpParams.put("vnp_Amount", String.valueOf(totalAmount));
//        vnpParams.put("vnp_CurrCode", "VND");
//
//        if (bankCode != null && !bankCode.isEmpty()) {
//            vnpParams.put("vnp_BankCode", bankCode);
//        }
//        vnpParams.put("vnp_TxnRef", vnpTxnRef);
//        vnpParams.put("vnp_OrderInfo", vnpOrderInfo);
//        vnpParams.put("vnp_OrderType", orderType);
//
//        if (language != null && !language.isEmpty()) {
//            vnpParams.put("vnp_Locale", language);
//        } else {
//            vnpParams.put("vnp_Locale", "vn");
//        }
//
//        vnpParams.put("vnp_ReturnUrl", VnpayConfig.vnp_Returnurl);
//        vnpParams.put("vnp_IpAddr", vnpIpAddr);
//
//        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//        String vnpCreateDate = formatter.format(cld.getTime());
//        vnpParams.put("vnp_CreateDate", vnpCreateDate);
//        cld.add(Calendar.MINUTE, 15);
//        String vnpExpireDate = formatter.format(cld.getTime());
//        vnpParams.put("vnp_ExpireDate", vnpExpireDate);
//
//        // Billing Information
//        vnpParams.put("vnp_Bill_Mobile", billingMobile);
//        vnpParams.put("vnp_Bill_Email", billingEmail);
//
//        if (fullName != null && !fullName.isEmpty()) {
//            int idx = fullName.indexOf(' ');
//            String firstName = fullName.substring(0, idx);
//            String lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);
//            vnpParams.put("vnp_Bill_FirstName", firstName);
//            vnpParams.put("vnp_Bill_LastName", lastName);
//        }
//
//        vnpParams.put("vnp_Bill_Address", billingAddress);
//        vnpParams.put("vnp_Bill_City", billingCity);
//        vnpParams.put("vnp_Bill_Country", billingCountry);
//        if (billingState != null && !billingState.isEmpty()) {
//            vnpParams.put("vnp_Bill_State", billingState);
//        }
//
//        // Invoice Information
//        vnpParams.put("vnp_Inv_Phone", invPhone);
//        vnpParams.put("vnp_Inv_Email", invEmail);
//        vnpParams.put("vnp_Inv_Customer", invCustomer);
//        vnpParams.put("vnp_Inv_Address", billingAddress);
//        vnpParams.put("vnp_Inv_Company", invCompany);
//        vnpParams.put("vnp_Inv_Taxcode", invTaxCode);
//        vnpParams.put("vnp_Inv_Type", invType);
//
//        // Build query and hash
//        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
//        Collections.sort(fieldNames);
//        StringBuilder hashData = new StringBuilder();
//        StringBuilder query = new StringBuilder();
//
//        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext(); ) {
//            String fieldName = itr.next();
//            String fieldValue = vnpParams.get(fieldName);
//            if (fieldValue != null && !fieldValue.isEmpty()) {
//                hashData.append(fieldName).append('=')
//                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
//                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
//                        .append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
//                if (itr.hasNext()) {
//                    query.append('&');
//                    hashData.append('&');
//                }
//            }
//        }
//
//        String queryUrl = query.toString();
//        String vnpSecureHash = VnpayConfig.hmacSHA512(VnpayConfig.vnp_HashSecret, hashData.toString());
//        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
//        String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;
//
//        JsonObject responseJson = new JsonObject();
//        responseJson.addProperty("code", "00");
//        responseJson.addProperty("message", "success");
//        responseJson.addProperty("data", paymentUrl);
//
//        return ResponseEntity.ok(responseJson);
//    }
}