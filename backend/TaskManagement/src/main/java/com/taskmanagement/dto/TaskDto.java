package com.taskmanagement.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    
    private Long id;
    
    @NotEmpty(message = "Task title should not be empty")
    private String title;
    
    private String description;
    
    private LocalDate dueDate;
    
    @NotNull(message = "Task status should not be null")
    private String status;
}
