package com.demo.hrportal.controller;

import com.demo.hrportal.model.Employee;
import com.demo.hrportal.repository.EmployeeRepository;
import com.demo.hrportal.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    
    private final EmployeeRepository employeeRepository;
    
    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    
    private boolean hasAccess(Long employeeId, UserPrincipal principal, boolean adminOnly) {
        if ("ADMIN".equals(principal.getRole())) {
            return true;
        }
        if (adminOnly) {
            return false;
        }
        return principal.getId().equals(employeeId);
    }
    
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(@AuthenticationPrincipal UserPrincipal principal) {
        if ("ADMIN".equals(principal.getRole())) {
            return ResponseEntity.ok(employeeRepository.findAll());
        }
        return ResponseEntity.ok(employeeRepository.findById(principal.getId())
            .map(List::of)
            .orElse(List.of()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id, 
            @AuthenticationPrincipal UserPrincipal principal) {
        
        if (!hasAccess(id, principal, false)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access denied"));
        }
        
        return employeeRepository.findById(id)
            .map(emp -> {
                Map<String, Object> response = new HashMap<>();
                response.put("id", emp.getId());
                response.put("email", emp.getEmail());
                response.put("fullName", emp.getFullName());
                response.put("department", emp.getDepartment());
                response.put("position", emp.getPosition());
                response.put("hireDate", emp.getHireDate());
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/salary")
    public ResponseEntity<?> getEmployeeSalary(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        if (!hasAccess(id, principal, false)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access denied"));
        }
        
        return employeeRepository.findById(id)
            .map(emp -> {
                Map<String, Object> response = new HashMap<>();
                response.put("id", emp.getId());
                response.put("fullName", emp.getFullName());
                response.put("salary", emp.getSalary());
                if ("ADMIN".equals(principal.getRole()) || principal.getId().equals(id)) {
                    response.put("ssn", emp.getSsn());
                }
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id,
            @RequestBody Map<String, Object> updates,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        if (!hasAccess(id, principal, true)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access denied"));
        }
        
        return employeeRepository.findById(id)
            .map(emp -> {
                if (updates.containsKey("department")) {
                    emp.setDepartment((String) updates.get("department"));
                }
                if (updates.containsKey("position")) {
                    emp.setPosition((String) updates.get("position"));
                }
                employeeRepository.save(emp);
                return ResponseEntity.ok(Map.of("message", "Employee updated"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
