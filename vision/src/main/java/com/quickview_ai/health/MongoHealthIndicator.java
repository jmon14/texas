package com.quickview_ai.health;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.bson.Document;

import java.util.HashMap;
import java.util.Map;

@Service
public class MongoHealthIndicator {

    private static final Logger logger = LoggerFactory.getLogger(MongoHealthIndicator.class);
    
    private final MongoTemplate mongoTemplate;

    public MongoHealthIndicator(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Map<String, Object> checkHealth() {
        Map<String, Object> healthStatus = new HashMap<>();
        try {
            // Test MongoDB connectivity by getting database stats
            Document stats = mongoTemplate.getDb().runCommand(new Document("dbStats", 1));
            
            logger.debug("MongoDB connectivity check successful");
            
            healthStatus.put("status", "UP");
            healthStatus.put("database", mongoTemplate.getDb().getName());
            // Use stats.get() instead of getInteger() to handle both Long and Integer values
            // MongoDB dbStats can return Long values that cause ClassCastException with getInteger()
            healthStatus.put("collections", stats.get("collections"));
            healthStatus.put("objects", stats.get("objects"));
            healthStatus.put("message", "Connected");
                    
        } catch (Exception e) {
            logger.error("MongoDB connectivity check failed", e);
            
            healthStatus.put("status", "DOWN");
            healthStatus.put("database", mongoTemplate.getDb().getName());
            healthStatus.put("message", "Disconnected");
            healthStatus.put("error", e.getMessage());
        }
        return healthStatus;
    }
}