package com.java.shopapp.config;

import com.java.shopapp.enums.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;


import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


import javax.crypto.spec.SecretKeySpec;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity
public class SecurityConfig {


    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    private final String[] PUBLIC_ENDPOINTS = {"/users","/auth/**", "/login/**","/users/**"};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST,PUBLIC_ENDPOINTS).permitAll()

                        .requestMatchers(HttpMethod.PUT,PUBLIC_ENDPOINTS).permitAll()

                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-ui/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/client").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/client/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/product-list").permitAll()

                        .requestMatchers(HttpMethod.GET, "/payment/**").permitAll()


                        // Cart
                        .requestMatchers(HttpMethod.GET, "/cart").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.DELETE, "/cart").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        //Cart-details
                        .requestMatchers(HttpMethod.POST, "/cart-detail").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.DELETE, "/cart-detail/{id}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.GET, "/cart-detail").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        //Order
                        .requestMatchers(HttpMethod.POST, "/order").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.POST, "/order/{id}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.PUT, "/order").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/order", "/order/filter").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.GET, "/order/manager", "/order/manager/filter").hasRole(Role.ADMIN.name())
                        //Order-Details
                        .requestMatchers(HttpMethod.GET, "/order-details").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        //Product
                        .requestMatchers(HttpMethod.POST, "/products").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/products").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/products/{productId}").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/products/{productId}").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/products/{productId}").hasRole(Role.ADMIN.name())


                        //User
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/users/my-info").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.PUT, "/users/{userId}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())



                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            response.sendRedirect("http://localhost:3000/auth/signingoogle");
                        })

                );


        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtConverter())));

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        corsConfiguration.setAllowedMethods(Collections.singletonList("*"));
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true); // Cho phép gửi credentials (JWT)


        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }

    @Bean
    JwtAuthenticationConverter jwtConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // "SCOPE_" -> "ROLE_"
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        // Custom converter để đọc role từ "scope.name"
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            // Lấy claim "scope"
            Map<String, Object> scope = jwt.getClaim("scope");
            if (scope != null && scope.containsKey("name")) {
                String roleName = "ROLE_" + scope.get("name"); // -> ROLE_ADMIN
                authorities.add(new SimpleGrantedAuthority(roleName));
                System.out.println("ROLE: " + roleName);
            }

            return authorities;
        });

        return converter;
    }



    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
