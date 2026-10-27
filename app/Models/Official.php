<?php

namespace App\Models;

use App\Observers\OfficialObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([OfficialObserver::class])]
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
