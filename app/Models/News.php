<?php

namespace App\Models;

use App\Support\HtmlSanitizer;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $category
 * @property string|null $content
 * @property string|null $image_path
 * @property string $status
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class News extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'category',
        'content',
        'image_path',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Sanitize the news content on every write to prevent stored XSS.
     *
     * @return Attribute<string, string|null>
     */
    protected function content(): Attribute
    {
        return Attribute::set(fn (?string $value) => HtmlSanitizer::clean($value));
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
