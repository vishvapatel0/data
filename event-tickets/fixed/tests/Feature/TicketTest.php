<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    protected function getToken($email, $password)
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $email,
            'password' => $password,
        ]);

        return $response->json('access_token');
    }

    public function test_login_success()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user1@example.com',
            'password' => 'user123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token']);
    }

    public function test_user_can_view_own_ticket()
    {
        $token = $this->getToken('user1@example.com', 'user123');

        $response = $this->getJson('/api/tickets/2', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson(['user_id' => 2]);
    }

    public function test_user_cannot_view_other_ticket()
    {
        $token = $this->getToken('attacker@example.com', 'attacker123');

        $response = $this->getJson('/api/tickets/1', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(403);
    }

    public function test_user_cannot_transfer_other_ticket()
    {
        $token = $this->getToken('attacker@example.com', 'attacker123');

        $response = $this->postJson('/api/tickets/1/transfer', [
            'recipient_email' => 'attacker@example.com',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_ticket()
    {
        $token = $this->getToken('admin@example.com', 'admin123');

        $response = $this->getJson('/api/tickets/2', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200);
    }

    public function test_unauthenticated_access_denied()
    {
        $response = $this->getJson('/api/tickets/1');

        $response->assertStatus(401);
    }
}
