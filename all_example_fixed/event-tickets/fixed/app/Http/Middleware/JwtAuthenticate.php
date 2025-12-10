<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token required'], 401);
        }

        try {
            $payload = JWT::decode($token, new Key(config('app.jwt_secret'), 'HS256'));
            $user = User::find($payload->user_id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

            $request->user = $user;
            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
}
