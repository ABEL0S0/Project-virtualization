FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

CMD ["/bin/sh", "-c", "sleep 15 && java -jar app.jar"]
