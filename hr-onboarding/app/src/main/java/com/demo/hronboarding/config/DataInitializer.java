package com.demo.hronboarding.config;

import com.demo.hronboarding.model.Employee;
import com.demo.hronboarding.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Employee(
                    "admin@example.com",
                    encoder.encode("admin123"),
                    "Admin User",
                    "IT",
                    "ADMIN"
                ));
                repository.save(new Employee(
                    "user1@example.com",
                    encoder.encode("user123"),
                    "Regular Employee",
                    "Engineering",
                    "EMPLOYEE"
                ));
                repository.save(new Employee(
                    "attacker@example.com",
                    encoder.encode("attacker123"),
                    "Attacker User",
                    "Sales",
                    "EMPLOYEE"
                ));
            }
        };
    }
}
