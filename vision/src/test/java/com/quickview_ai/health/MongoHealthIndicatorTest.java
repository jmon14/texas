package com.quickview_ai.health;

import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MongoHealthIndicatorTest {

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private MongoDatabase mongoDatabase;

    private MongoHealthIndicator mongoHealthIndicator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mongoHealthIndicator = new MongoHealthIndicator(mongoTemplate);
    }

    @Test
    void checkHealth_WhenMongoIsHealthy_ShouldReturnUpStatus() {
        // Given
        Document stats = new Document();
        stats.put("collections", 5L); // Long value to test our fix
        stats.put("objects", 1000L);  // Long value to test our fix
        
        when(mongoTemplate.getDb()).thenReturn(mongoDatabase);
        when(mongoDatabase.getName()).thenReturn("vision");
        when(mongoDatabase.runCommand(any(Document.class))).thenReturn(stats);

        // When
        Map<String, Object> result = mongoHealthIndicator.checkHealth();

        // Then
        assertEquals("UP", result.get("status"));
        assertEquals("vision", result.get("database"));
        assertEquals("Connected", result.get("message"));
        assertEquals(5L, result.get("collections")); // Should be Long, not Integer
        assertEquals(1000L, result.get("objects"));   // Should be Long, not Integer
    }

    @Test
    void checkHealth_WhenMongoThrowsException_ShouldReturnDownStatus() {
        // Given
        when(mongoTemplate.getDb()).thenReturn(mongoDatabase);
        when(mongoDatabase.getName()).thenReturn("vision");
        when(mongoDatabase.runCommand(any(Document.class))).thenThrow(new RuntimeException("Connection failed"));

        // When
        Map<String, Object> result = mongoHealthIndicator.checkHealth();

        // Then
        assertEquals("DOWN", result.get("status"));
        assertEquals("vision", result.get("database"));
        assertEquals("Disconnected", result.get("message"));
        assertEquals("Connection failed", result.get("error"));
    }

    @Test
    void checkHealth_WhenStatsContainIntegerValues_ShouldHandleCorrectly() {
        // Given
        Document stats = new Document();
        stats.put("collections", 3); // Integer value
        stats.put("objects", 500);   // Integer value
        
        when(mongoTemplate.getDb()).thenReturn(mongoDatabase);
        when(mongoDatabase.getName()).thenReturn("vision");
        when(mongoDatabase.runCommand(any(Document.class))).thenReturn(stats);

        // When
        Map<String, Object> result = mongoHealthIndicator.checkHealth();

        // Then
        assertEquals("UP", result.get("status"));
        assertEquals(3, result.get("collections")); // Should be Integer
        assertEquals(500, result.get("objects"));   // Should be Integer
    }
}