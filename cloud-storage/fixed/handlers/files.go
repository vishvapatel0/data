package handlers

import (
	"cloud-storage/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func verifyFileAccess(file *models.File, userID int64, role string, allowAdmin bool) bool {
	if file.OwnerID == userID {
		return true
	}
	if allowAdmin && role == "admin" {
		return true
	}
	return false
}

func ListFiles(c *gin.Context) {
	userID := c.GetInt64("userID")

	files, err := models.GetFilesByOwner(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch files"})
		return
	}

	if files == nil {
		files = []models.File{}
	}

	c.JSON(http.StatusOK, files)
}

func GetFile(c *gin.Context) {
	userID := c.GetInt64("userID")
	role := c.GetString("role")

	fileID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	file, err := models.GetFileByID(fileID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	if !verifyFileAccess(file, userID, role, true) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         file.ID,
		"owner_id":   file.OwnerID,
		"filename":   file.Filename,
		"size":       file.Size,
		"mime_type":  file.MimeType,
		"created_at": file.CreatedAt,
	})
}

func DownloadFile(c *gin.Context) {
	userID := c.GetInt64("userID")
	role := c.GetString("role")

	fileID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	file, err := models.GetFileByID(fileID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	if !verifyFileAccess(file, userID, role, true) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"filename":  file.Filename,
		"content":   file.Content,
		"mime_type": file.MimeType,
	})
}

func DeleteFile(c *gin.Context) {
	userID := c.GetInt64("userID")
	role := c.GetString("role")

	fileID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	file, err := models.GetFileByID(fileID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	if !verifyFileAccess(file, userID, role, false) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	if err := models.DeleteFile(file.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
}
