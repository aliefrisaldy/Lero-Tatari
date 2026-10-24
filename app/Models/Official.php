<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Official extends Model
{
    protected $fillable = [
        'name',
        'position',
        'category',
        'photo_path',
        'order_index',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'order_index' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
