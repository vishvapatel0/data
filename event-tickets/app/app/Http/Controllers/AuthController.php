<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $payload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'exp' => time() + 3600,
        ];

        $token = JWT::encode($payload, config('app.jwt_secret'), 'HS256');

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user);
    }
}
