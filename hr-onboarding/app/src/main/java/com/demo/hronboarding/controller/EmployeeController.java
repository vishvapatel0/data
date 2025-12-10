package com.demo.hronboarding.controller;

import com.demo.hronboarding.model.Employee;
import com.demo.hronboarding.repository.EmployeeRepository;
import com.demo.hronboarding.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeController(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");
        String fullName = data.get("fullName");
        String department = data.get("department");

        if (employeeRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        String role = "EMPLOYEE";
        if ("Management".equalsIgnoreCase(department) || 
            "Executive".equalsIgnoreCase(department) ||
            "C-Suite".equalsIgnoreCase(department)) {
            role = "MANAGER";
        }

        Employee employee = new Employee(
            email,
            passwordEncoder.encode(password),
            fullName,
            department,
            role
        );
        employeeRepository.save(employee);

        return ResponseEntity.ok(Map.of(
            "id", employee.getId(),
            "email", employee.getEmail(),
            "fullName", employee.getFullName(),
            "department", employee.getDepartment(),
            "role", employee.getRole()
        ));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
            "id", employee.getId(),
            "email", employee.getEmail(),
            "fullName", employee.getFullName(),
            "department", employee.getDepartment(),
            "role", employee.getRole()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentEmployee(@AuthenticationPrincipal UserPrincipal principal) {
        Employee employee = principal.getEmployee();
        return ResponseEntity.ok(Map.of(
            "id", employee.getId(),
            "email", employee.getEmail(),
            "fullName", employee.getFullName(),
            "department", employee.getDepartment(),
            "role", employee.getRole()
        ));
    }
}
