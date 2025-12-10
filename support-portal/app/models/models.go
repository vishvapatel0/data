package models

import (
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             int       `json:"id"`
	Email          string    `json:"email"`
	Password       string    `json:"-"`
	FullName       string    `json:"full_name"`
	Role           string    `json:"role"`
	TempAdminUntil time.Time `json:"temp_admin_until,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
}

type Ticket struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	CreatedBy   int       `json:"created_by"`
	AssignedTo  int       `json:"assigned_to,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	ResolvedAt  time.Time `json:"resolved_at,omitempty"`
}

type Database struct {
	Users   []User
	Tickets []Ticket
	mu      sync.RWMutex
}

var DB *Database

func InitDB() {
	hashedAdmin, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	hashedUser, _ := bcrypt.GenerateFromPassword([]byte("user123"), bcrypt.DefaultCost)
	hashedAttacker, _ := bcrypt.GenerateFromPassword([]byte("attacker123"), bcrypt.DefaultCost)

	DB = &Database{
		Users: []User{
			{
				ID:        1,
				Email:     "admin@example.com",
				Password:  string(hashedAdmin),
				FullName:  "Admin User",
				Role:      "admin",
				CreatedAt: time.Now(),
			},
			{
				ID:        2,
				Email:     "user1@example.com",
				Password:  string(hashedUser),
				FullName:  "Support Engineer",
				Role:      "support",
				CreatedAt: time.Now(),
			},
			{
				ID:             3,
				Email:          "attacker@example.com",
				Password:       string(hashedAttacker),
				FullName:       "Attacker User",
				Role:           "support",
				TempAdminUntil: time.Now().Add(-24 * time.Hour),
				CreatedAt:      time.Now(),
			},
		},
		Tickets: []Ticket{
			{
				ID:          1,
				Title:       "Login Issue",
				Description: "Cannot login to the system",
				Status:      "open",
				Priority:    "high",
				CreatedBy:   2,
				CreatedAt:   time.Now(),
			},
			{
				ID:          2,
				Title:       "Password Reset",
				Description: "Need to reset password for user account",
				Status:      "open",
				Priority:    "medium",
				CreatedBy:   3,
				CreatedAt:   time.Now(),
			},
			{
				ID:          3,
				Title:       "System Slow",
				Description: "System is running very slow",
				Status:      "resolved",
				Priority:    "low",
				CreatedBy:   2,
				AssignedTo:  1,
				CreatedAt:   time.Now().Add(-48 * time.Hour),
				ResolvedAt:  time.Now().Add(-24 * time.Hour),
			},
		},
	}
}

func (db *Database) GetUserByEmail(email string) *User {
	db.mu.RLock()
	defer db.mu.RUnlock()
	for i := range db.Users {
		if db.Users[i].Email == email {
			return &db.Users[i]
		}
	}
	return nil
}

func (db *Database) GetUserByID(id int) *User {
	db.mu.RLock()
	defer db.mu.RUnlock()
	for i := range db.Users {
		if db.Users[i].ID == id {
			return &db.Users[i]
		}
	}
	return nil
}

func (db *Database) GetAllUsers() []User {
	db.mu.RLock()
	defer db.mu.RUnlock()
	return db.Users
}

func (db *Database) UpdateUser(user *User) {
	db.mu.Lock()
	defer db.mu.Unlock()
	for i := range db.Users {
		if db.Users[i].ID == user.ID {
			db.Users[i] = *user
			return
		}
	}
}

func (db *Database) GetAllTickets() []Ticket {
	db.mu.RLock()
	defer db.mu.RUnlock()
	return db.Tickets
}

func (db *Database) GetTicketByID(id int) *Ticket {
	db.mu.RLock()
	defer db.mu.RUnlock()
	for i := range db.Tickets {
		if db.Tickets[i].ID == id {
			return &db.Tickets[i]
		}
	}
	return nil
}

func (db *Database) UpdateTicket(ticket *Ticket) {
	db.mu.Lock()
	defer db.mu.Unlock()
	for i := range db.Tickets {
		if db.Tickets[i].ID == ticket.ID {
			db.Tickets[i] = *ticket
			return
		}
	}
}
