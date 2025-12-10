<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create users
        $admin = User::create([
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'name' => 'Admin User',
            'role' => 'admin',
        ]);

        $user1 = User::create([
            'email' => 'user1@example.com',
            'password' => Hash::make('user123'),
            'name' => 'Regular User',
            'role' => 'user',
        ]);

        $attacker = User::create([
            'email' => 'attacker@example.com',
            'password' => Hash::make('attacker123'),
            'name' => 'Test Account',
            'role' => 'user',
        ]);

        // Create events
        $concert = Event::create([
            'name' => 'Summer Music Festival',
            'date' => '2024-07-15',
            'venue' => 'City Arena',
            'description' => 'Annual summer concert featuring top artists',
        ]);

        $conference = Event::create([
            'name' => 'Tech Conference 2024',
            'date' => '2024-09-20',
            'venue' => 'Convention Center',
            'description' => 'Leading technology conference',
        ]);

        // Create tickets
        Ticket::create([
            'user_id' => $admin->id,
            'event_id' => $concert->id,
            'ticket_type' => 'vip',
            'price' => 500.00,
            'seat' => 'VIP-001',
            'status' => 'active',
        ]);

        Ticket::create([
            'user_id' => $user1->id,
            'event_id' => $concert->id,
            'ticket_type' => 'premium',
            'price' => 150.00,
            'seat' => 'A-101',
            'status' => 'active',
        ]);

        Ticket::create([
            'user_id' => $user1->id,
            'event_id' => $conference->id,
            'ticket_type' => 'standard',
            'price' => 50.00,
            'seat' => 'G-250',
            'status' => 'active',
        ]);

        Ticket::create([
            'user_id' => $attacker->id,
            'event_id' => $concert->id,
            'ticket_type' => 'standard',
            'price' => 50.00,
            'seat' => 'Z-999',
            'status' => 'active',
        ]);
    }
}
