package com.java.shopapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;

@Getter
@Setter
public class GoogleAccountDTO {
    private String at_hash;
    private String sub;
    private boolean email_verified;
    private String iss;
    private String given_name;
    private String nonce;
    private String picture;
    private ArrayList<String> aud;
    private String azp;
    private String name;
    private Date exp;
    private String family_name;
    private Date iat;
    private String email;
}
