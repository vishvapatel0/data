package main

import (
	"cloud-storage/handlers"
	"cloud-storage/middleware"
	"cloud-storage/models"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := models.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	if err := models.SeedDB(); err != nil {
		log.Fatal("Failed to seed database:", err)
	}

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Cloud Storage API", "docs": "/docs"})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	auth := r.Group("/auth")
	{
		auth.POST("/login", handlers.Login)
	}

	files := r.Group("/files")
	files.Use(middleware.AuthMiddleware())
	{
		files.GET("", handlers.ListFiles)
		files.GET("/:id", handlers.GetFile)
		files.GET("/:id/download", handlers.DownloadFile)
		files.DELETE("/:id", handlers.DeleteFile)
	}

	r.Run(":8080")
}
