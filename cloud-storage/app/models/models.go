package models

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        int64     `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	FullName  string    `json:"full_name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type File struct {
	ID        int64     `json:"id"`
	OwnerID   int64     `json:"owner_id"`
	Filename  string    `json:"filename"`
	Size      int64     `json:"size"`
	MimeType  string    `json:"mime_type"`
	Content   string    `json:"content,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

var DB *sql.DB

func InitDB() error {
	var err error
	DB, err = sql.Open("sqlite3", ":memory:")
	if err != nil {
		return err
	}

	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		full_name TEXT NOT NULL,
		role TEXT DEFAULT 'user',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS files (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		owner_id INTEGER NOT NULL,
		filename TEXT NOT NULL,
		size INTEGER DEFAULT 0,
		mime_type TEXT DEFAULT 'application/octet-stream',
		content TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (owner_id) REFERENCES users(id)
	);
	`

	_, err = DB.Exec(schema)
	return err
}

func SeedDB() error {
	users := []struct {
		Email    string
		Password string
		FullName string
		Role     string
	}{
		{"admin@example.com", "admin123", "Admin User", "admin"},
		{"user1@example.com", "user123", "Regular User", "user"},
		{"attacker@example.com", "attacker123", "Test Account", "user"},
	}

	for _, u := range users {
		hash, _ := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		_, err := DB.Exec(
			"INSERT OR IGNORE INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)",
			u.Email, string(hash), u.FullName, u.Role,
		)
		if err != nil {
			return err
		}
	}

	files := []struct {
		OwnerID  int64
		Filename string
		Size     int64
		MimeType string
		Content  string
	}{
		{1, "admin_config.json", 1024, "application/json", `{"api_key": "sk-admin-secret-key-12345", "database": "production"}`},
		{1, "financial_report.pdf", 2048, "application/pdf", "Confidential financial data..."},
		{2, "my_document.txt", 512, "text/plain", "User1's personal document content"},
		{2, "vacation_photo.jpg", 4096, "image/jpeg", "Base64 encoded image data..."},
		{3, "attacker_file.txt", 100, "text/plain", "Attacker's own file"},
	}

	for _, f := range files {
		_, err := DB.Exec(
			"INSERT INTO files (owner_id, filename, size, mime_type, content) VALUES (?, ?, ?, ?, ?)",
			f.OwnerID, f.Filename, f.Size, f.MimeType, f.Content,
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func GetUserByEmail(email string) (*User, error) {
	user := &User{}
	err := DB.QueryRow(
		"SELECT id, email, password, full_name, role, created_at FROM users WHERE email = ?",
		email,
	).Scan(&user.ID, &user.Email, &user.Password, &user.FullName, &user.Role, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func GetFileByID(id int64) (*File, error) {
	file := &File{}
	err := DB.QueryRow(
		"SELECT id, owner_id, filename, size, mime_type, content, created_at FROM files WHERE id = ?",
		id,
	).Scan(&file.ID, &file.OwnerID, &file.Filename, &file.Size, &file.MimeType, &file.Content, &file.CreatedAt)
	if err != nil {
		return nil, err
	}
	return file, nil
}

func GetFilesByOwner(ownerID int64) ([]File, error) {
	rows, err := DB.Query(
		"SELECT id, owner_id, filename, size, mime_type, created_at FROM files WHERE owner_id = ?",
		ownerID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []File
	for rows.Next() {
		var f File
		err := rows.Scan(&f.ID, &f.OwnerID, &f.Filename, &f.Size, &f.MimeType, &f.CreatedAt)
		if err != nil {
			return nil, err
		}
		files = append(files, f)
	}
	return files, nil
}

func DeleteFile(id int64) error {
	_, err := DB.Exec("DELETE FROM files WHERE id = ?", id)
	return err
}
