# Etapa 1: compila la aplicación
FROM maven:3.8.7-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: crea la imagen de ejecución
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/cruma-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto que usa Spring Boot
EXPOSE 8080

# Arranca la app
ENTRYPOINT ["java","-jar","app.jar"]
