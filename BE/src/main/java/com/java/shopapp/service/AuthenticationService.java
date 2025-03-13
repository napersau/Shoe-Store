package com.java.shopapp.service;

import com.java.shopapp.dto.request.AuthenticationRequest;
import com.java.shopapp.dto.request.IntrospectRequest;
import com.java.shopapp.dto.request.LogoutRequest;
import com.java.shopapp.dto.response.AuthenticationResponse;
import com.java.shopapp.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    void logout(LogoutRequest request) throws ParseException, JOSEException;
}
