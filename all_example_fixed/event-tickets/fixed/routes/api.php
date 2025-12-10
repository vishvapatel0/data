<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;

Route::prefix('api')->group(function () {
    Route::get('/', function () {
        return response()->json(['message' => 'Event Tickets API', 'docs' => '/docs']);
    });

    Route::get('/health', function () {
        return response()->json(['status' => 'healthy']);
    });

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::middleware('jwt.auth')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::get('/tickets/{id}', [TicketController::class, 'show']);
        Route::post('/tickets/{id}/transfer', [TicketController::class, 'transfer']);
        Route::post('/tickets/{id}/upgrade', [TicketController::class, 'upgrade']);
        Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
    });
});
