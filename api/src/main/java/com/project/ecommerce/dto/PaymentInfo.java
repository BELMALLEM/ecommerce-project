package com.project.ecommerce.dto;

public record PaymentInfo(
        Long amount,
        String currency,
        String receiptEmail
){ }
