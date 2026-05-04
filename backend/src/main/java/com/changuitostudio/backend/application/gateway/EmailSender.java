package com.changuitostudio.backend.application.gateway;


public interface EmailSender {

    void sendEmail(String to, String subject, String body);
}

