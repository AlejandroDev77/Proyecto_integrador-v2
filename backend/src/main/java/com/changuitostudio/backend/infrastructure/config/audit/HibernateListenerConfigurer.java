package com.changuitostudio.backend.infrastructure.config.audit;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HibernateListenerConfigurer {

    private final EntityManagerFactory entityManagerFactory;
    private final HibernateAuditListener hibernateAuditListener;

    public HibernateListenerConfigurer(EntityManagerFactory entityManagerFactory, HibernateAuditListener hibernateAuditListener) {
        this.entityManagerFactory = entityManagerFactory;
        this.hibernateAuditListener = hibernateAuditListener;
    }

    @PostConstruct
    public void registerListeners() {
        SessionFactoryImpl sessionFactory = entityManagerFactory.unwrap(SessionFactoryImpl.class);
        EventListenerRegistry registry = sessionFactory.getServiceRegistry().getService(EventListenerRegistry.class);

        if (registry != null) {
            registry.getEventListenerGroup(EventType.POST_INSERT).appendListener(hibernateAuditListener);
            registry.getEventListenerGroup(EventType.POST_UPDATE).appendListener(hibernateAuditListener);
            registry.getEventListenerGroup(EventType.POST_DELETE).appendListener(hibernateAuditListener);
        }
    }
}
