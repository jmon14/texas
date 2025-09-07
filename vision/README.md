# Vision API

A Spring Boot microservice for poker range analysis and management, providing RESTful APIs for creating, updating, and managing poker hand ranges.

## 🏗️ Architecture Overview

Vision is a **specialized microservice** responsible for:

- **Poker Range Management** - CRUD operations for hand ranges
- **Range Analysis** - Store and retrieve poker hand strategies
- **User-Specific Ranges** - Personalized range storage per user
- **MongoDB Integration** - NoSQL database for flexible range storage

## 📁 Project Structure

```
vision/
├── src/
│   ├── main/
│   │   ├── java/com/quickview_ai/
│   │   │   ├── controllers/     # REST API endpoints
│   │   │   ├── entities/        # Domain models
│   │   │   ├── repositories/    # Data access layer
│   │   │   ├── services/        # Business logic
│   │   │   ├── config/          # Configuration classes
│   │   │   └── VisionApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Unit and integration tests
├── pom.xml                      # Maven dependencies
└── Dockerfile                   # Container configuration
```

## 🚀 Development

**For complete setup instructions, see [CONTRIBUTING.md](../CONTRIBUTING.md)**

### Environment Configuration

For local development outside Docker, you may need to configure MongoDB connection:

```bash
# Create application-local.properties
cat > src/main/resources/application-local.properties << EOF
# MongoDB connection for local development
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=vision

# Optional: MongoDB authentication if needed
# spring.data.mongodb.username=your-username
# spring.data.mongodb.password=your-password
EOF

# Run with local profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### Key Spring Boot Commands

```bash
# Local development (if not using Docker)
./mvnw spring-boot:run       # Start development server
./mvnw test                  # Run tests
./mvnw clean package         # Build JAR file
```

### Local Development (Optional)

```bash
# For local development without Docker
cd vision
mvn clean install
mvn spring-boot:run
```

## 🎯 Core Features

### 🃏 Poker Range Management

Comprehensive range analysis and storage:

- **Range CRUD Operations**: Create, read, update, delete ranges
- **User-Specific Storage**: Each user has their own range collection
- **Hand Range Structure**: 13x13 matrix representing all poker hands
- **Action Assignment**: Define fold, call, raise, check percentages
- **Validation**: Input validation for range data integrity

### 📊 Data Models

#### **Range Entity**

```java
@Document(collection = "ranges")
public class Range {
    @Id
    private String id;

    @NotNull
    @Indexed(unique = true)
    private String name;

    @NotNull
    private HandRange[] handsRange;

    @NotNull
    private String userId;
}
```

#### **HandRange Entity**

```java
public class HandRange {
    @NotNull
    private Float rangeFraction;

    @NotNull
    private String label;

    @NotNull
    private Action[] actions;
}
```

#### **Action Entity**

```java
public class Action {
    @NotNull
    private ActionType type;  // FOLD, CALL, RAISE, CHECK

    @NotNull
    private Float percentage;
}
```

## 🌐 API Endpoints

### Range Management

```
GET    /ranges                   # Get all ranges
GET    /ranges/{id}              # Get range by ID
GET    /ranges/user/{userId}     # Get ranges by user ID
POST   /ranges                   # Create new range
PUT    /ranges/{id}              # Update existing range
DELETE /ranges/{id}              # Delete range
```

### Request/Response Examples

#### **Create Range**

```json
POST /ranges
{
  "name": "UTG Opening Range",
  "userId": "user123",
  "handsRange": [
    {
      "rangeFraction": 0.15,
      "label": "AA, KK, QQ",
      "actions": [
        {"type": "RAISE", "percentage": 100.0}
      ]
    }
  ]
}
```

#### **Get User Ranges**

```json
GET /ranges/user/user123
[
  {
    "id": "range123",
    "name": "UTG Opening Range",
    "userId": "user123",
    "handsRange": [...]
  }
]
```

## 🗄️ Database Integration

### MongoDB Configuration

- **Connection Pool**: Optimized connection management
- **Indexing**: Unique indexes on range names
- **User Isolation**: Ranges separated by userId
- **Flexible Schema**: NoSQL for complex range structures

### Connection Settings

```properties
spring.data.mongodb.max-connection-pool-size=10
spring.data.mongodb.min-connection-pool-size=5
spring.data.mongodb.max-connection-idle-time=30000
spring.data.mongodb.max-connection-life-time=60000
spring.data.mongodb.connection-timeout=10000
spring.data.mongodb.socket-timeout=30000
```

## 🔧 Configuration

### Application Properties

```properties
# Server Configuration
server.port=3001
spring.application.name=vision

# MongoDB Configuration
spring.data.mongodb.host=mongodb
spring.data.mongodb.port=27017
spring.data.mongodb.database=vision
```

### CORS Configuration

Supports multiple origins for cross-origin requests:

- `http://localhost:8080` (development)
- `http://quickview:8080` (Docker)
- `https://allinrange.com` (production)
- `https://www.allinrange.com` (production)

## 🛡️ Security & Validation

### Input Validation

- **Bean Validation**: @NotNull, @Valid annotations
- **Request Validation**: Automatic validation on endpoints
- **Error Handling**: Graceful error responses
- **Data Integrity**: Ensures valid range structures

### CORS Security

- **Origin Control**: Whitelisted domains only
- **Method Control**: All HTTP methods allowed
- **Credential Support**: Cookies and authentication headers
- **Header Control**: All headers allowed

## 📚 API Documentation

### OpenAPI/Swagger

Access interactive API documentation at:

```
http://localhost:3001/swagger-ui.html
```

### Auto-Generated Documentation

- **SpringDoc OpenAPI**: Automatic API documentation
- **Request/Response Schemas**: Auto-generated from entities
- **Interactive Testing**: Try endpoints directly in browser

## 📊 Performance Features

### Connection Pooling

- **Optimized Pool Size**: 5-10 connections
- **Connection Lifecycle**: Automatic cleanup
- **Timeout Management**: Configurable timeouts
- **Error Recovery**: Automatic reconnection

### Caching Strategy

- **MongoDB Indexes**: Optimized queries
- **User-Specific Queries**: Efficient filtering
- **Connection Reuse**: Minimized overhead

## 🔍 Monitoring & Health

### Logging

- **Structured Logging**: JSON format
- **Request Tracking**: Request/response logging
- **Error Tracking**: Detailed error information

## 🤝 Contributing

### Development Guidelines

1. **Follow Spring Boot Patterns**: Use standard Spring conventions
2. **Write Tests**: Unit and integration tests required
3. **Validate Input**: Use Bean Validation annotations
4. **Document APIs**: Add OpenAPI annotations
5. **Handle Errors**: Proper exception handling

### Code Style

- **Java 21**: Latest LTS features
- **Lombok**: Reduce boilerplate code
- **Spring Boot**: Standard Spring patterns
- **Maven**: Standard build tooling

## 📄 License

This project is part of the Texas Poker application and is licensed under the MIT License.
