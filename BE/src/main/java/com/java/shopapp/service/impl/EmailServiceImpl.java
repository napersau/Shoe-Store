package com.java.shopapp.service.impl;

import com.java.shopapp.dto.request.MailRequest;
import com.java.shopapp.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender emailSender;

    @Async // Gửi bất đồng bộ
    public void sendSimpleMessage(MailRequest request) throws MessagingException {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("khoigptptit@gmail.com");
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());

            // HTML body
            String htmlContent = "<html><body>" +
                    "<h3>Xin chào!</h3>" +
                    "<p>" + request.getText() + "</p>" +
                    "<br><em>Đây là email tự động, vui lòng không trả lời lại.</em>" +
                    "</body></html>";
            helper.setText(htmlContent, true); // true: gửi HTML

            emailSender.send(message);
        } catch (Exception e) {
            throw new MessagingException("Không thể gửi email: " + e.getMessage());
        }
    }

}
