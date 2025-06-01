package com.java.shopapp.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailResponse {
    private String to;
    private String subject;
    private String text;
}
