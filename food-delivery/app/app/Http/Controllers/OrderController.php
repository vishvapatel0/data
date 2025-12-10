<?php

namespace App\Http\Controllers;

use App\Models\Database;
use Illuminate\Http\Request;

class OrderController
{
    public function index(Request $request)
    {
        $user = $request->attributes->get('user');
        $db = Database::getInstance();
        
        $orders = $db->getOrdersByUserId($user->id);
        
        return response()->json(array_values($orders));
    }

    public function show(Request $request, int $id)
    {
        $db = Database::getInstance();
        $order = $db->getOrderById($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json([
            'id' => $order->id,
            'user_id' => $order->userId,
            'restaurant_name' => $order->restaurantName,
            'items' => $order->items,
            'total' => $order->total,
            'status' => $order->status,
            'delivery_address' => $order->deliveryAddress,
            'created_at' => $order->createdAt
        ]);
    }

    public function cancel(Request $request, int $id)
    {
        $db = Database::getInstance();
        $order = $db->getOrderById($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        if ($order->status === 'delivered') {
            return response()->json(['error' => 'Cannot cancel delivered order'], 400);
        }

        $order->status = 'cancelled';
        $db->updateOrder($order);

        return response()->json([
            'message' => 'Order cancelled successfully',
            'order' => [
                'id' => $order->id,
                'status' => $order->status
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->attributes->get('user');
        
        return response()->json([
            'message' => 'Order created',
            'order_id' => rand(100, 999)
        ], 201);
    }
}
