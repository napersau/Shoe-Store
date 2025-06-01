package com.java.shopapp.service;

import com.java.shopapp.dto.request.MailRequest;
import jakarta.mail.MessagingException;
import org.springframework.mail.SimpleMailMessage;

public interface EmailService {
    void sendSimpleMessage(MailRequest request) throws MessagingException;
    void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment) throws MessagingException;
}
