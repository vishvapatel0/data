<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $fillable = ['email', 'password', 'name', 'role'];
    protected $hidden = ['password'];
    
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}

class Event extends Model
{
    protected $fillable = ['name', 'date', 'venue', 'description'];
    
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}

class Ticket extends Model
{
    protected $fillable = ['user_id', 'event_id', 'ticket_type', 'price', 'seat', 'status'];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
