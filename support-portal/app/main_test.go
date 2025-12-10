package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"support-portal/models"
)

func TestMain(m *testing.M) {
	models.InitDB()
	m.Run()
}

func getToken(t *testing.T, email, password string) string {
	router := setupRouter()

	body, _ := json.Marshal(map[string]string{
		"email":    email,
		"password": password,
	})

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	return response["access_token"].(string)
}

func TestLogin(t *testing.T) {
	router := setupRouter()

	body, _ := json.Marshal(map[string]string{
		"email":    "admin@example.com",
		"password": "admin123",
	})

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetTickets(t *testing.T) {
	router := setupRouter()
	token := getToken(t, "user1@example.com", "user123")

	req, _ := http.NewRequest("GET", "/tickets", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestResolveTicketAsAdmin(t *testing.T) {
	router := setupRouter()
	token := getToken(t, "admin@example.com", "admin123")

	req, _ := http.NewRequest("PUT", "/tickets/1/resolve", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestResolveTicketAsExpiredTempAdmin(t *testing.T) {
	router := setupRouter()
	token := getToken(t, "attacker@example.com", "attacker123")

	req, _ := http.NewRequest("PUT", "/tickets/2/resolve", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetAllUsersAsAdmin(t *testing.T) {
	router := setupRouter()
	token := getToken(t, "admin@example.com", "admin123")

	req, _ := http.NewRequest("GET", "/admin/users", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetAllUsersAsExpiredTempAdmin(t *testing.T) {
	router := setupRouter()
	token := getToken(t, "attacker@example.com", "attacker123")

	req, _ := http.NewRequest("GET", "/admin/users", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
