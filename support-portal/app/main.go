package main

import (
	"github.com/gin-gonic/gin"
	"support-portal/handlers"
	"support-portal/middleware"
	"support-portal/models"
)

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Support Portal API", "version": "1.0.0"})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	auth := r.Group("/auth")
	{
		auth.POST("/login", handlers.Login)
	}

	tickets := r.Group("/tickets")
	tickets.Use(middleware.AuthMiddleware())
	{
		tickets.GET("", handlers.GetTickets)
		tickets.GET("/:id", handlers.GetTicket)
		tickets.PUT("/:id/resolve", middleware.AdminMiddleware(), handlers.ResolveTicket)
	}

	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		admin.GET("/users", handlers.GetAllUsers)
		admin.POST("/grant-temp-access", handlers.GrantTempAdminAccess)
	}

	return r
}

func main() {
	models.InitDB()
	r := setupRouter()
	r.Run(":8080")
}
