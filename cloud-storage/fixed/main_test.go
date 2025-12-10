package main

import (
	"bytes"
	"cloud-storage/handlers"
	"cloud-storage/middleware"
	"cloud-storage/models"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	models.InitDB()
	models.SeedDB()

	r := gin.Default()
	r.POST("/auth/login", handlers.Login)

	files := r.Group("/files")
	files.Use(middleware.AuthMiddleware())
	{
		files.GET("", handlers.ListFiles)
		files.GET("/:id", handlers.GetFile)
		files.GET("/:id/download", handlers.DownloadFile)
		files.DELETE("/:id", handlers.DeleteFile)
	}

	return r
}

func getToken(router *gin.Engine, email, password string) string {
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

func TestLoginSuccess(t *testing.T) {
	router := setupTestRouter()

	body, _ := json.Marshal(map[string]string{
		"email":    "user1@example.com",
		"password": "user123",
	})

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestAccessOwnFile(t *testing.T) {
	router := setupTestRouter()
	token := getToken(router, "user1@example.com", "user123")

	req, _ := http.NewRequest("GET", "/files/3", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestCannotAccessOtherUserFile(t *testing.T) {
	router := setupTestRouter()
	token := getToken(router, "attacker@example.com", "attacker123")

	req, _ := http.NewRequest("GET", "/files/1", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Errorf("Expected status 403, got %d", w.Code)
	}
}

func TestCannotDownloadOtherUserFile(t *testing.T) {
	router := setupTestRouter()
	token := getToken(router, "attacker@example.com", "attacker123")

	req, _ := http.NewRequest("GET", "/files/1/download", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Errorf("Expected status 403, got %d", w.Code)
	}
}

func TestAdminCanAccessAnyFile(t *testing.T) {
	router := setupTestRouter()
	token := getToken(router, "admin@example.com", "admin123")

	req, _ := http.NewRequest("GET", "/files/3", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestUnauthenticatedAccess(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest("GET", "/files/1", nil)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", w.Code)
	}
}
