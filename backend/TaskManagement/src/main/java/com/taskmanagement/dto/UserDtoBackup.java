package com.taskmanagement.dto;

public class UserDto {
    
    private Long id;
    private String name;
    private String username;
    private String email;
    private boolean active;
    
    // Default constructor
    public UserDto() {}
    
    // All args constructor
    public UserDto(Long id, String name, String username, String email, boolean active) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.active = active;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public boolean isActive() { return active; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setActive(boolean active) { this.active = active; }
}
