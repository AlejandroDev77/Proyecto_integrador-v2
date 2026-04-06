package com.changuitostudio.backend.application.gateway;

/**
 * Puerto de salida: EnvÃ­o de emails.
 * La implementaciÃ³n concreta (SMTP, SendGrid, etc.) estÃ¡ en infrastructure.
 */
public interface EmailSender {

    void sendEmail(String to, String subject, String body);
}

