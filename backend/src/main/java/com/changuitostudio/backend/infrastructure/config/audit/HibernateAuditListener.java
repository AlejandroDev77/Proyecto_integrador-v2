package com.changuitostudio.backend.infrastructure.config.audit;

import jakarta.persistence.Table;

import com.changuitostudio.backend.domain.model.AuditLog;
import com.changuitostudio.backend.application.repository.AuditLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.event.spi.*;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.lang.reflect.Field;
import java.time.temporal.TemporalAccessor;
import java.util.Collection;

@Component
public class HibernateAuditListener implements PostInsertEventListener, PostUpdateEventListener, PostDeleteEventListener {

    private static final Set<String> SENSITIVE_FIELDS = Set.of(
            "pasUsu", "password", "secret2fa", "secret", "token", "accessToken", "refreshToken");

    @Autowired
    @Lazy
    private AuditLogRepository auditLogRepository;

    @Autowired
    @Lazy
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper;

    public HibernateAuditListener() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.findAndRegisterModules();
    }

    @Override
    public void onPostInsert(PostInsertEvent event) {
        if (event.getEntity() instanceof AuditLog) return;
        Object[] state = event.getState() != null ? event.getState() : event.getPersister().getPropertyValues(event.getEntity());
        saveAuditLog(event.getEntity(), "INSERT", null, extractState(event.getPersister(), state, event.getPersister().getPropertyInsertability()), event.getId());
    }

    @Override
    public void onPostUpdate(PostUpdateEvent event) {
        if (event.getEntity() instanceof AuditLog) return;
        Object[] currentState = event.getState() != null ? event.getState() : event.getPersister().getPropertyValues(event.getEntity());
        saveAuditLog(event.getEntity(), "UPDATE", extractState(event.getPersister(), event.getOldState(), event.getPersister().getPropertyUpdateability()), extractState(event.getPersister(), currentState, event.getPersister().getPropertyUpdateability()), event.getId());
    }

    @Override
    public void onPostDelete(PostDeleteEvent event) {
        if (event.getEntity() instanceof AuditLog) return;
        Object[] deletedState = event.getDeletedState() != null ? event.getDeletedState() : event.getPersister().getPropertyValues(event.getEntity());
        saveAuditLog(event.getEntity(), "DELETE", extractState(event.getPersister(), deletedState, null), null, event.getId());
    }

    private void saveAuditLog(Object entity, String action, Map<String, Object> oldState, Map<String, Object> newState, Object recordId) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        
        String tableName = entity.getClass().getSimpleName().toLowerCase();
        Table tableAnn = entity.getClass().getAnnotation(Table.class);
        if (tableAnn != null && !tableAnn.name().isEmpty()) {
            tableName = tableAnn.name();
        }
        log.setTableName(tableName);
        
        log.setRecordId(recordId != null ? Long.parseLong(recordId.toString()) : null);

        try {
            log.setOldValues(oldState != null ? objectMapper.writeValueAsString(oldState) : null);
            log.setNewValues(newState != null ? objectMapper.writeValueAsString(newState) : null);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            String principalName = auth.getName();
            try {
                Long idUsu = Long.parseLong(principalName);
                log.setUserId(idUsu);
                String codUsu = jdbcTemplate.queryForObject("SELECT cod_usu FROM usuarios WHERE id_usu = ?", String.class, idUsu);
                log.setCodUsu(codUsu);
            } catch (NumberFormatException e) {
                // If the principal is already the cod_usu (username) instead of ID
                log.setCodUsu(principalName);
            } catch (Exception e) {
                log.setCodUsu(principalName);
            }
        }

        auditLogRepository.save(log);
    }

    private Map<String, Object> extractState(EntityPersister persister, Object[] state, boolean[] propertyInclusion) {
        if (state == null) return null;
        Map<String, Object> map = new HashMap<>();
        String[] propertyNames = persister.getPropertyNames();
        for (int i = 0; i < propertyNames.length; i++) {
            // Only include the property if it's allowed (or if we aren't filtering)
            if (propertyInclusion == null || propertyInclusion[i]) {
                String property = propertyNames[i];
                map.put(property, SENSITIVE_FIELDS.contains(property) ? "[REDACTADO]" : sanitizeValue(state[i]));
            }
        }
        return map;
    }

    private Object sanitizeValue(Object value) {
        if (value == null || value instanceof CharSequence || value instanceof Number || value instanceof Boolean
                || value instanceof Enum<?> || value instanceof TemporalAccessor || value instanceof java.util.Date) {
            return value;
        }
        if (value instanceof Collection<?> collection) {
            return Map.of("cantidad", collection.size());
        }
        Object id = findEntityId(value);
        if (id != null) {
            return Map.of("id", id);
        }
        return String.valueOf(value);
    }

    private Object findEntityId(Object entity) {
        Class<?> type = entity.getClass();
        while (type != null && type != Object.class) {
            for (Field field : type.getDeclaredFields()) {
                if (field.isAnnotationPresent(jakarta.persistence.Id.class)) {
                    try {
                        field.setAccessible(true);
                        return field.get(entity);
                    } catch (IllegalAccessException ignored) {
                        return null;
                    }
                }
            }
            type = type.getSuperclass();
        }
        return null;
    }

    @Override
    public boolean requiresPostCommitHandling(EntityPersister persister) {
        return false;
    }
}
