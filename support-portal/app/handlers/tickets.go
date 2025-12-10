package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"support-portal/models"
)

func GetTickets(c *gin.Context) {
	tickets := models.DB.GetAllTickets()
	c.JSON(http.StatusOK, tickets)
}

func GetTicket(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
		return
	}

	ticket := models.DB.GetTicketByID(id)
	if ticket == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

func ResolveTicket(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
		return
	}

	ticket := models.DB.GetTicketByID(id)
	if ticket == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	userInterface, _ := c.Get("user")
	user := userInterface.(*models.User)

	ticket.Status = "resolved"
	ticket.ResolvedAt = time.Now()
	ticket.AssignedTo = user.ID
	models.DB.UpdateTicket(ticket)

	c.JSON(http.StatusOK, ticket)
}

func GetAllUsers(c *gin.Context) {
	users := models.DB.GetAllUsers()
	c.JSON(http.StatusOK, users)
}

type GrantTempAccessRequest struct {
	UserID   int `json:"user_id" binding:"required"`
	Duration int `json:"duration_hours" binding:"required"`
}

func GrantTempAdminAccess(c *gin.Context) {
	var req GrantTempAccessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user := models.DB.GetUserByID(req.UserID)
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.TempAdminUntil = time.Now().Add(time.Duration(req.Duration) * time.Hour)
	models.DB.UpdateUser(user)

	c.JSON(http.StatusOK, gin.H{
		"message":          "Temporary admin access granted",
		"user_id":          user.ID,
		"temp_admin_until": user.TempAdminUntil,
	})
}
