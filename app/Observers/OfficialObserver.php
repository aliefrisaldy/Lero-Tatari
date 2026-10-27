<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Official;

class OfficialObserver
{
    /**
     * Log a newly created official.
     */
    public function created(Official $official): void
    {
        $this->log(
            $official,
            'created',
            "Menambahkan aparat {$official->name} ({$official->position})",
        );
    }

    /**
     * Log changes made to an official.
     */
    public function updated(Official $official): void
    {
        $changes = collect($official->getChanges())
            ->except('updated_at')
            ->all();

        if ($changes === []) {
            return;
        }

        $labels = [
            'name' => 'nama',
            'position' => 'jabatan',
            'category' => 'kategori',
            'photo_path' => 'foto',
            'order_index' => 'urutan',
            'is_active' => 'status',
        ];

        $fields = collect(array_keys($changes))
            ->map(fn (string $field) => $labels[$field] ?? $field)
            ->implode(', ');

        $this->log(
            $official,
            'updated',
            "Memperbarui {$fields} aparat {$official->name}",
            $changes,
        );
    }

    /**
     * Log a deleted official.
     */
    public function deleted(Official $official): void
    {
        $this->log(
            $official,
            'deleted',
            "Menghapus aparat {$official->name} ({$official->position})",
        );
    }

    /**
     * Persist the activity entry.
     *
     * @param  array<string, mixed>|null  $changes
     */
    private function log(
        Official $official,
        string $action,
        string $description,
        ?array $changes = null,
    ): void {
        // Skip seeders and other console commands without an authenticated user.
        if (app()->runningInConsole() && ! auth()->check()) {
            return;
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'subject_type' => Official::class,
            'subject_id' => $official->id,
            'action' => $action,
            'description' => $description,
            'changes' => $changes,
        ]);
    }
}
