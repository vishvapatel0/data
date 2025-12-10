package com.demo.hronboarding.controller;

import com.demo.hronboarding.model.Employee;
import com.demo.hronboarding.repository.EmployeeRepository;
import com.demo.hronboarding.security.JwtTokenProvider;
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
                         PasswordEncoder passwordEncoder,
                         JwtTokenProvider tokenProvider) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Employee employee = employeeRepository.findByEmail(email)
            .orElse(null);

        if (employee == null || !passwordEncoder.matches(password, employee.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = tokenProvider.generateToken(employee.getId(), employee.getEmail(), employee.getRole());

        return ResponseEntity.ok(Map.of(
            "access_token", token,
            "token_type", "bearer",
            "user", Map.of(
                "id", employee.getId(),
                "email", employee.getEmail(),
                "fullName", employee.getFullName(),
                "role", employee.getRole(),
                "department", employee.getDepartment()
            )
        ));
    }
}
