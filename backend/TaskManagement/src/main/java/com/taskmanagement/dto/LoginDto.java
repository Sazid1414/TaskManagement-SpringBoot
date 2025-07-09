package com.taskmanagement.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {
    
    @NotEmpty(message = "Username or email should not be empty")
    private String usernameOrEmail;
    
    @NotEmpty(message = "Password should not be empty")
    private String password;
}
