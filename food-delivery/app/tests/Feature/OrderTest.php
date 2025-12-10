<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Database;

class OrderTest extends TestCase
{
    private function getToken(string $email, string $password): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $email,
            'password' => $password
        ]);
        
        return $response->json('access_token');
    }

    public function test_login_success()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user1@example.com',
            'password' => 'user123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }

    public function test_get_orders()
    {
        $token = $this->getToken('user1@example.com', 'user123');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/orders');

        $response->assertStatus(200);
    }

    public function test_get_order_by_id()
    {
        $token = $this->getToken('user1@example.com', 'user123');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/orders/1');

        $response->assertStatus(200)
            ->assertJsonPath('id', 1);
    }

    public function test_cancel_own_order()
    {
        $token = $this->getToken('user1@example.com', 'user123');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/orders/1/cancel');

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Order cancelled successfully');
    }

    public function test_cancel_other_user_order()
    {
        $token = $this->getToken('attacker@example.com', 'attacker123');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/orders/1/cancel');

        $response->assertStatus(200);
    }

    public function test_view_other_user_order()
    {
        $token = $this->getToken('attacker@example.com', 'attacker123');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/orders/1');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_access()
    {
        $response = $this->getJson('/api/orders');
        $response->assertStatus(401);
    }
}
