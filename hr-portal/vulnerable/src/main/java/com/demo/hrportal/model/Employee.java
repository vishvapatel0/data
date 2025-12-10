package com.demo.hrportal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    private String department;
    private String position;
    private BigDecimal salary;
    private String ssn;
    private LocalDate hireDate;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.EMPLOYEE;
    
    public enum Role {
        ADMIN, MANAGER, EMPLOYEE
    }
}
