package com.demo.hronboarding.security;

import com.demo.hronboarding.model.Employee;

public class UserPrincipal {
    private final Employee employee;

    public UserPrincipal(Employee employee) {
        this.employee = employee;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Long getId() {
        return employee.getId();
    }

    public String getEmail() {
        return employee.getEmail();
    }

    public String getRole() {
        return employee.getRole();
    }
}
