<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $fillable = [
        'description',
        'order_index',
    ];

    protected function casts(): array
    {
        return [
            'order_index' => 'integer',
        ];
    }
}
