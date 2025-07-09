package com.taskmanagement.controller;

import com.taskmanagement.dto.TaskDto;
import com.taskmanagement.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task API")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Create a new task")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ResponseEntity<TaskDto> createTask(
            @Valid @RequestBody TaskDto taskDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get username from UserDetails
        String username = userDetails.getUsername();
        
        // For simplicity, we're assuming userId is 1 here
        // In a real application, you would retrieve the user ID from the database
        // based on the authenticated user's username
        TaskDto createdTask = taskService.createTask(taskDto, 1L);
        
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all tasks for current user")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasksByUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // For simplicity, we're assuming userId is 1 here
        List<TaskDto> tasks = taskService.getAllTasksByUserId(1L);
        
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Get task by ID")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTaskById(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // For simplicity, we're assuming userId is 1 here
        TaskDto task = taskService.getTaskById(taskId, 1L);
        
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Update task")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskDto taskDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // For simplicity, we're assuming userId is 1 here
        TaskDto updatedTask = taskService.updateTask(taskId, taskDto, 1L);
        
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(summary = "Delete task")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // For simplicity, we're assuming userId is 1 here
        taskService.deleteTask(taskId, 1L);
        
        return ResponseEntity.ok("Task deleted successfully");
    }

    @Operation(summary = "Get all tasks (Admin only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
}
