package com.demo.hrportal.controller;

import com.demo.hrportal.model.Employee;
import com.demo.hrportal.repository.EmployeeRepository;
import com.demo.hrportal.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    
    public AuthController(EmployeeRepository employeeRepository, 
            PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        return employeeRepository.findByEmail(email)
            .filter(emp -> passwordEncoder.matches(password, emp.getPassword()))
            .map(emp -> {
                String token = tokenProvider.generateToken(emp.getId(), emp.getEmail(), emp.getRole().name());
                return ResponseEntity.ok(Map.of(
                    "access_token", token,
                    "token_type", "bearer"
                ));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
