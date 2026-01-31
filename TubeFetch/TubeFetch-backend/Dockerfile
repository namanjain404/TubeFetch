# --- STAGE 1: Build the JAR ---
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app
# Copy your source code and pom.xml
COPY . .
# Build the application and skip tests for speed
RUN mvn clean package -DskipTests

# --- STAGE 2: Setup the Runtime Environment ---
FROM eclipse-temurin:17-jre-jammy

# Install ffmpeg, python3, and curl
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Copy the JAR from the 'build' stage defined above
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]