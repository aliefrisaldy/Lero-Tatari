<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of admin/operator users.
     */
    public function index(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'status', 'last_login_at', 'created_at')
            ->latest('id')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults()],
            'role' => ['required', Rule::in(['super_admin', 'operator'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],
        ], 201);
    }

    /**
     * Update the specified user's information.
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['super_admin', 'operator'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        // Prevent Super Admin from demoting/deactivating themselves
        if ($user->id === $request->user()->id) {
            if ($validated['role'] !== 'super_admin' || $validated['status'] !== 'active') {
                return response()->json([
                    'message' => 'Anda tidak dapat mengubah role atau status akun Anda sendiri.',
                ], 422);
            }
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Data pengguna berhasil diperbarui.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Reset the user's password.
     */
    public function resetPassword(Request $request, int|string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => ['required', 'string', Password::defaults()],
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        // Optionally revoke user's existing tokens
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password pengguna berhasil direset.',
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, int|string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus.',
        ]);
    }
}
