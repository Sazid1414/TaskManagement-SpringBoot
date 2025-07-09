package com.taskmanagement.service;

import com.taskmanagement.dto.JwtAuthResponse;
import com.taskmanagement.dto.LoginDto;
import com.taskmanagement.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    JwtAuthResponse login(LoginDto loginDto);
}
