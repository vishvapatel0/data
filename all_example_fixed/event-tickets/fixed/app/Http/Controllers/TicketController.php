<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    private function verifyTicketOwnership($ticket, $user, $allowAdmin = false)
    {
        if ($ticket->user_id === $user->id) {
            return true;
        }
        if ($allowAdmin && $user->role === 'admin') {
            return true;
        }
        return false;
    }

    public function index(Request $request)
    {
        $tickets = Ticket::where('user_id', $request->user->id)
            ->with('event')
            ->get();

        return response()->json($tickets);
    }

    public function show(Request $request, $id)
    {
        $ticket = Ticket::with('event')->find($id);

        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }

        if (!$this->verifyTicketOwnership($ticket, $request->user, true)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        return response()->json($ticket);
    }

    public function transfer(Request $request, $id)
    {
        $request->validate([
            'recipient_email' => 'required|email|exists:users,email',
        ]);

        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }

        if (!$this->verifyTicketOwnership($ticket, $request->user, false)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $recipient = User::where('email', $request->recipient_email)->first();

        $ticket->user_id = $recipient->id;
        $ticket->save();

        return response()->json([
            'message' => 'Ticket transferred successfully',
            'ticket' => $ticket,
        ]);
    }

    public function upgrade(Request $request, $id)
    {
        $request->validate([
            'new_type' => 'required|in:standard,premium,vip',
        ]);

        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }

        if (!$this->verifyTicketOwnership($ticket, $request->user, false)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $upgradePrices = [
            'standard' => 50,
            'premium' => 150,
            'vip' => 300,
        ];

        $ticket->ticket_type = $request->new_type;
        $ticket->price = $upgradePrices[$request->new_type];
        $ticket->save();

        return response()->json([
            'message' => 'Ticket upgraded successfully',
            'ticket' => $ticket,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }

        if (!$this->verifyTicketOwnership($ticket, $request->user, false)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $ticket->delete();

        return response()->json(['message' => 'Ticket cancelled successfully']);
    }
}
