package com.taskmanagement.service;

import com.taskmanagement.dto.TaskDto;
import java.util.List;

public interface TaskService {
    TaskDto createTask(TaskDto taskDto, Long userId);
    List<TaskDto> getAllTasksByUserId(Long userId);
    TaskDto getTaskById(Long taskId, Long userId);
    TaskDto updateTask(Long taskId, TaskDto taskDto, Long userId);
    void deleteTask(Long taskId, Long userId);
    List<TaskDto> getAllTasks();
}
