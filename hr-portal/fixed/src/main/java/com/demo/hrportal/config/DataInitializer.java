package com.demo.hrportal.config;

import com.demo.hrportal.model.Employee;
import com.demo.hrportal.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner initDatabase(EmployeeRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (repository.count() == 0) {
                Employee admin = new Employee();
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                admin.setDepartment("HR");
                admin.setPosition("HR Director");
                admin.setSalary(new BigDecimal("150000"));
                admin.setSsn("123-45-6789");
                admin.setHireDate(LocalDate.of(2020, 1, 15));
                admin.setRole(Employee.Role.ADMIN);
                repository.save(admin);
                
                Employee user1 = new Employee();
                user1.setEmail("user1@example.com");
                user1.setPassword(passwordEncoder.encode("user123"));
                user1.setFullName("John Employee");
                user1.setDepartment("Engineering");
                user1.setPosition("Software Engineer");
                user1.setSalary(new BigDecimal("85000"));
                user1.setSsn("987-65-4321");
                user1.setHireDate(LocalDate.of(2022, 3, 1));
                user1.setRole(Employee.Role.EMPLOYEE);
                repository.save(user1);
                
                Employee attacker = new Employee();
                attacker.setEmail("attacker@example.com");
                attacker.setPassword(passwordEncoder.encode("attacker123"));
                attacker.setFullName("Test Account");
                attacker.setDepartment("Marketing");
                attacker.setPosition("Marketing Associate");
                attacker.setSalary(new BigDecimal("55000"));
                attacker.setSsn("111-22-3333");
                attacker.setHireDate(LocalDate.of(2023, 6, 15));
                attacker.setRole(Employee.Role.EMPLOYEE);
                repository.save(attacker);
            }
        };
    }
}
