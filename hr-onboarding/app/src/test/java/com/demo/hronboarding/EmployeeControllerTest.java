package com.demo.hronboarding;

import com.demo.hronboarding.model.Employee;
import com.demo.hronboarding.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;
    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", "admin@example.com",
                    "password", "admin123"
                ))))
                .andReturn();
        
        Map<String, Object> adminResponse = objectMapper.readValue(
            adminResult.getResponse().getContentAsString(), Map.class);
        adminToken = (String) adminResponse.get("access_token");

        MvcResult userResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", "user1@example.com",
                    "password", "user123"
                ))))
                .andReturn();
        
        Map<String, Object> userResponse = objectMapper.readValue(
            userResult.getResponse().getContentAsString(), Map.class);
        userToken = (String) userResponse.get("access_token");
    }

    @Test
    void registerEmployeeWithRegularDepartment() throws Exception {
        mockMvc.perform(post("/api/employees/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", "newuser@example.com",
                    "password", "pass123",
                    "fullName", "New User",
                    "department", "Engineering"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("EMPLOYEE"));
    }

    @Test
    void registerEmployeeWithManagementDepartment() throws Exception {
        mockMvc.perform(post("/api/employees/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", "manager@example.com",
                    "password", "pass123",
                    "fullName", "Manager User",
                    "department", "Management"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }

    @Test
    void getAllEmployeesAsAdmin() throws Exception {
        mockMvc.perform(get("/api/employees")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void getAllEmployeesAsRegularUser() throws Exception {
        mockMvc.perform(get("/api/employees")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void getEmployeeById() throws Exception {
        mockMvc.perform(get("/api/employees/1")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());
    }
}
