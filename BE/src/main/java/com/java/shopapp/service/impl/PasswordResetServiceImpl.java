package com.java.shopapp.service.impl;


import com.java.shopapp.dto.request.ForgotPasswordRequest;
import com.java.shopapp.dto.request.MailRequest;
import com.java.shopapp.entity.PasswordResetToken;
import com.java.shopapp.entity.User;
import com.java.shopapp.repository.PasswordResetTokenRepository;
import com.java.shopapp.repository.UserRepository;
import com.java.shopapp.service.EmailService;
import com.java.shopapp.service.PasswordResetService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PasswordResetServiceImpl implements PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender emailSender;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    @Override
    public void sendPasswordResetOtp(ForgotPasswordRequest request) {
        // Kiểm tra user có tồn tại không
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        // Xóa các token cũ chưa sử dụng của email này
        tokenRepository.markTokensAsUsed(request.getEmail());

        // Tạo OTP mới
        String otp = generateOtp();

        // Lưu token vào database
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(request.getEmail());
        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        token.setUsed(false);
        tokenRepository.save(token);

        // Gửi email sử dụng EmailService như form cũ
        try {
            MailRequest mailRequest = new MailRequest();
            mailRequest.setTo(request.getEmail());
            mailRequest.setSubject("Mã OTP đặt lại mật khẩu");
            mailRequest.setText(String.format(
                    "Mã OTP của bạn để đặt lại mật khẩu là: <strong>%s</strong><br>" +
                            "Mã này có hiệu lực trong %d phút.<br>" +
                            "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.",
                    otp, OTP_EXPIRY_MINUTES
            ));

            emailService.sendSimpleMessage(mailRequest);
            log.info("OTP sent successfully to email: {}", request.getEmail());

        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", request.getEmail(), e);
            throw new RuntimeException("Không thể gửi email OTP. Vui lòng thử lại sau.");
        }
    }

    @Override
    public boolean verifyOtp(ForgotPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository
                .findByEmailAndOtpAndUsedFalse(request.getEmail(), request.getOtp());

        if (tokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken token = tokenOpt.get();

        // Kiểm tra token có hết hạn không
        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        return true;
    }

    @Override
    public void resetPassword(ForgotPasswordRequest request) {
        // Verify OTP trước
        if (!verifyOtp(request)) {
            throw new RuntimeException("OTP không hợp lệ hoặc đã hết hạn");
        }

        // Tìm user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Đánh dấu token đã sử dụng
        tokenRepository.markTokensAsUsed(request.getEmail());

        log.info("Password reset successfully for email: {}", request.getEmail());
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }

    // Tự động xóa các token hết hạn mỗi giờ
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
