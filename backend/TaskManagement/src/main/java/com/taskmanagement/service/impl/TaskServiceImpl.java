package com.taskmanagement.service.impl;

import com.taskmanagement.dto.TaskDto;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.model.Task;
import com.taskmanagement.model.User;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import com.taskmanagement.service.TaskService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TaskDto createTask(TaskDto taskDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = mapToEntity(taskDto);
        task.setUser(user);
        task.setStatus(Task.TaskStatus.valueOf(taskDto.getStatus()));

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    @Override
    public List<TaskDto> getAllTasksByUserId(Long userId) {
        // Check if user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Task> tasks = taskRepository.findByUserId(userId);
        return tasks.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto getTaskById(Long taskId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Check if the task belongs to the user
        if (!task.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to access this task");
        }

        return mapToDto(task);
    }

    @Override
    public TaskDto updateTask(Long taskId, TaskDto taskDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Check if the task belongs to the user
        if (!task.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to update this task");
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setStatus(Task.TaskStatus.valueOf(taskDto.getStatus()));

        Task updatedTask = taskRepository.save(task);
        return mapToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long taskId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Check if the task belongs to the user
        if (!task.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    @Override
    public List<TaskDto> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Convert Entity to DTO
    private TaskDto mapToDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setDueDate(task.getDueDate());
        taskDto.setStatus(task.getStatus().name());
        return taskDto;
    }

    // Convert DTO to Entity
    private Task mapToEntity(TaskDto taskDto) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        if (taskDto.getStatus() != null) {
            task.setStatus(Task.TaskStatus.valueOf(taskDto.getStatus()));
        } else {
            task.setStatus(Task.TaskStatus.TODO);
        }
        return task;
    }
}
