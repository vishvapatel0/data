<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use App\Models\Database;
use Illuminate\Http\Request;

class AuthController
{
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        if (!$email || !$password) {
            return response()->json(['error' => 'Email and password required'], 400);
        }

        $db = Database::getInstance();
        $user = $db->getUserByEmail($email);

        if (!$user || !password_verify($password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $payload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'exp' => time() + 3600
        ];

        $token = JWT::encode($payload, env('JWT_SECRET', 'your-secret-key'), 'HS256');

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'full_name' => $user->fullName,
                'role' => $user->role
            ]
        ]);
    }
}
