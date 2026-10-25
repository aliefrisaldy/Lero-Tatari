<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property Carbon|null $captured_at
 * @property string|null $image_path
 * @property bool $is_active
 * @property int $order_index
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Gallery extends Model
{
    protected $fillable = [
        'title',
        'captured_at',
        'image_path',
        'is_active',
        'order_index',
    ];

    protected function casts(): array
    {
        return [
            'captured_at' => 'date',
            'is_active' => 'boolean',
            'order_index' => 'integer',
        ];
    }
}
