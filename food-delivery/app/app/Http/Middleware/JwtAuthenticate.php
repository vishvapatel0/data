<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Database;

class JwtAuthenticate
{
    public function handle($request, Closure $next)
    {
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['error' => 'Authorization header required'], 401);
        }

        $token = substr($authHeader, 7);
        
        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET', 'your-secret-key'), 'HS256'));
            
            $db = Database::getInstance();
            $user = $db->getUserById($decoded->user_id);
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }
            
            $request->attributes->set('user', $user);
            
            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
}
