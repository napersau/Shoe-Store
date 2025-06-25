package com.java.shopapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId;
    private String message;
    private String response;
    private String messageType; // USER, BOT

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public ChatMessage(String sessionId, String message, String botResponse, String conversation) {
        this.sessionId = sessionId;
        this.message = message;
        this.response = response;
        this.messageType = messageType;
        this.createdAt = LocalDateTime.now();
    }
}
