<?php

namespace App\Models;

class User
{
    public int $id;
    public string $email;
    public string $password;
    public string $fullName;
    public string $role;

    public function __construct(int $id, string $email, string $password, string $fullName, string $role)
    {
        $this->id = $id;
        $this->email = $email;
        $this->password = $password;
        $this->fullName = $fullName;
        $this->role = $role;
    }
}

class Order
{
    public int $id;
    public int $userId;
    public string $restaurantName;
    public array $items;
    public float $total;
    public string $status;
    public string $deliveryAddress;
    public string $createdAt;

    public function __construct(
        int $id,
        int $userId,
        string $restaurantName,
        array $items,
        float $total,
        string $status,
        string $deliveryAddress,
        string $createdAt
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->restaurantName = $restaurantName;
        $this->items = $items;
        $this->total = $total;
        $this->status = $status;
        $this->deliveryAddress = $deliveryAddress;
        $this->createdAt = $createdAt;
    }
}

class Database
{
    private static ?Database $instance = null;
    public array $users = [];
    public array $orders = [];

    private function __construct()
    {
        $this->seedData();
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function seedData(): void
    {
        $this->users = [
            new User(1, 'admin@example.com', password_hash('admin123', PASSWORD_BCRYPT), 'Admin User', 'admin'),
            new User(2, 'user1@example.com', password_hash('user123', PASSWORD_BCRYPT), 'Regular User', 'customer'),
            new User(3, 'attacker@example.com', password_hash('attacker123', PASSWORD_BCRYPT), 'Attacker User', 'customer'),
        ];

        $this->orders = [
            new Order(1, 2, 'Pizza Palace', ['Margherita Pizza', 'Garlic Bread'], 25.99, 'pending', '123 Main St', '2024-01-15 12:00:00'),
            new Order(2, 2, 'Burger King', ['Whopper Meal', 'Onion Rings'], 15.49, 'delivered', '123 Main St', '2024-01-14 18:30:00'),
            new Order(3, 3, 'Sushi Express', ['Dragon Roll', 'Miso Soup'], 32.00, 'in_transit', '456 Oak Ave', '2024-01-15 19:00:00'),
        ];
    }

    public function getUserByEmail(string $email): ?User
    {
        foreach ($this->users as $user) {
            if ($user->email === $email) {
                return $user;
            }
        }
        return null;
    }

    public function getUserById(int $id): ?User
    {
        foreach ($this->users as $user) {
            if ($user->id === $id) {
                return $user;
            }
        }
        return null;
    }

    public function getOrdersByUserId(int $userId): array
    {
        return array_filter($this->orders, fn($order) => $order->userId === $userId);
    }

    public function getOrderById(int $id): ?Order
    {
        foreach ($this->orders as $order) {
            if ($order->id === $id) {
                return $order;
            }
        }
        return null;
    }

    public function updateOrder(Order $updatedOrder): void
    {
        foreach ($this->orders as $key => $order) {
            if ($order->id === $updatedOrder->id) {
                $this->orders[$key] = $updatedOrder;
                return;
            }
        }
    }
}
