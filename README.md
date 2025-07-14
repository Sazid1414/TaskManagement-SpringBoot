# Task Management Application Backend

This is the backend for the Task Management Application built with Spring Boot.

## Technology Stack

- Java 21
- Spring Boot 3.5.3
- Spring Security with JWT Authentication
- Spring Data JPA
- MySQL Database
- Swagger/OpenAPI for API Documentation

## Prerequisites

- JDK 21
- Maven
- MySQL Server

## Configuration

The application is configured to connect to a MySQL database. You can modify the database configuration in `src/main/resources/application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanagement?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

## Running the Application

To run the application, you can use the following Maven command:

```bash
mvn spring-boot:run
```

Or you can build the application and run the JAR file:

```bash
mvn clean package
java -jar target/TaskManagement-0.0.1-SNAPSHOT.jar
```

## API Documentation

The API documentation is available at:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks for the current user
- `GET /api/tasks/{taskId}` - Get a task by ID
- `PUT /api/tasks/{taskId}` - Update a task
- `DELETE /api/tasks/{taskId}` - Delete a task
- `GET /api/tasks/all` - Get all tasks (Admin only)

### User Management (Admin Only)

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get a user by ID
- `PATCH /api/users/{id}/deactivate` - Deactivate a user
- `DELETE /api/users/{id}` - Delete a user

## Authentication

The application uses JWT (JSON Web Token) for authentication. When a user logs in, a JWT token is generated and returned in the response. This token should be included in the `Authorization` header of subsequent requests:

```
Authorization: Bearer <token>
```

## Security

- Users can only access their own tasks
- Admin users can access all tasks and manage users
- Passwords are encrypted using BCrypt

## Error Handling

The application provides meaningful error messages for various scenarios:
- Resource not found
- Validation errors
- Authentication/Authorization errors

