package com.project.ecommerce.service;

import com.project.ecommerce.dao.CustomerRepository;
import com.project.ecommerce.dto.PaymentInfo;
import com.project.ecommerce.dto.Purchase;
import com.project.ecommerce.dto.PurchaseResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey){
        this.customerRepository = customerRepository;
        Stripe.apiKey = secretKey;
    }

    @Override
    public PurchaseResponse placeOrder(Purchase purchase){
        var order = purchase.order();

        var orderTrackingNumber = generateTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        var orderItems = purchase.orderItems();
        orderItems.forEach(order::add);

        order.setShippingAddress(purchase.shippingAddress());
        order.setBillingAddress(purchase.billingAddress());

        var customer = purchase.customer();
        var email = customer.getEmail();

        var customerFromDB = customerRepository.findByEmail(email);
        if(customerFromDB != null) {
            customer = customerFromDB;
        }
        customer.add(order);

        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        return PaymentIntent.create(PaymentIntentCreateParams.builder()
                .setAmount(paymentInfo.amount())
                .setCurrency(paymentInfo.currency())
                .setReceiptEmail(paymentInfo.receiptEmail())
                .addPaymentMethodType("card")
                .setDescription("Just Carrots Purchase")
                .build());
    }

    private String generateTrackingNumber() {
        //generate a random UUID
        return UUID.randomUUID().toString();
    }
}
