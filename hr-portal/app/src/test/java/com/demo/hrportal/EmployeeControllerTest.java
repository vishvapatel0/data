package com.demo.hrportal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private String getToken(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
            .andExpect(status().isOk())
            .andReturn();
        
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("access_token").asText();
    }
    
    @Test
    void testLoginSuccess() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"user1@example.com\",\"password\":\"user123\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.access_token").exists());
    }
    
    @Test
    void testLoginInvalidCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"user1@example.com\",\"password\":\"wrong\"}"))
            .andExpect(status().isUnauthorized());
    }
    
    @Test
    void testGetOwnEmployee() throws Exception {
        String token = getToken("user1@example.com", "user123");
        
        mockMvc.perform(get("/api/employees/2")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("user1@example.com"));
    }
    
    @Test
    void testAccessOtherEmployeeSalary() throws Exception {
        String token = getToken("attacker@example.com", "attacker123");
        
        mockMvc.perform(get("/api/employees/1/salary")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.salary").value(150000));
    }
    
    @Test
    void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/employees/1"))
            .andExpect(status().isUnauthorized());
    }
}
