package com.project.ecommerce.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain httpSecurity(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/orders/**?**").authenticated()
                        .requestMatchers("/api/members").authenticated()
                        .requestMatchers("/api/product-category").permitAll()
                        .anyRequest().permitAll())
                .cors(withDefaults())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }
}