# Use an official OpenJDK runtime as a parent image
FROM maven:3.9.6-amazoncorretto-21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use a smaller runtime image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/vision-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 3001

# Run the jar file with TLS configuration for MongoDB Atlas
ENTRYPOINT ["java", "-Djdk.tls.client.protocols=TLSv1.2", "-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts", "-Djavax.net.ssl.trustStorePassword=changeit", "-jar", "app.jar"]