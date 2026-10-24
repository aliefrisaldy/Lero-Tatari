<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Akses ditolak. Fitur ini hanya untuk Super Admin.',
                ], 403);
            }

            abort(403, 'Akses ditolak. Fitur ini hanya untuk Super Admin.');
        }

        return $next($request);
    }
}
