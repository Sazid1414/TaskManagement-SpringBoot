package com.taskmanagement.service;

import java.util.List;

import com.taskmanagement.dto.UserDto;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    void deactivateUser(Long id);
    void deleteUser(Long id);
}
