package com.project.ecommerce.dto;

import com.project.ecommerce.entity.Address;
import com.project.ecommerce.entity.Customer;
import com.project.ecommerce.entity.Order;
import com.project.ecommerce.entity.OrderItem;

import java.util.Set;

public record Purchase(
        Customer customer,
        Address shippingAddress,
        Address billingAddress,
        Order order,
        Set<OrderItem> orderItems
){ }
