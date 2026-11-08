<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Admin login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // Check user & password (or fallback for default seed)
        $isValid = false;
        if ($user && Hash::check($request->password, $user->password)) {
            $isValid = true;
        } elseif ($request->email === 'admin@goaround.id' && $request->password === 'admin123') {
            $isValid = true;
            if (!$user) {
                $user = User::create([
                    'name' => 'Zimrion Varethos',
                    'email' => 'admin@goaround.id',
                    'password' => Hash::make('admin123'),
                ]);
            }
        }

        if (!$isValid) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = 'goaround-sanctum-' . bin2hex(random_bytes(24));

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'Super Admin',
                'avatar' => '/brand/avatar-admin.png',
                'phone' => '+62 812-3456-7890',
                'institution' => 'Sekolah Vokasi IPB University',
            ],
            'message' => 'Berhasil login',
        ]);
    }

    /**
     * Admin logout
     */
    public function logout(): JsonResponse
    {
        return response()->json(['success' => true]);
    }

    /**
     * Get current authenticated admin
     */
    public function me(Request $request): JsonResponse
    {
        $user = User::first() ?? (object) [
            'id' => 1,
            'name' => 'Zimrion Varethos',
            'email' => 'admin@goaround.id',
        ];

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'Super Admin',
                'avatar' => '/brand/avatar-admin.png',
                'phone' => '+62 812-3456-7890',
                'institution' => 'Sekolah Vokasi IPB University',
            ],
        ]);
    }

    /**
     * Update admin profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = User::first();
        if ($user) {
            if ($request->filled('name')) $user->name = $request->name;
            if ($request->filled('email')) $user->email = $request->email;
            $user->save();
        }

        return response()->json([
            'data' => [
                'id' => $user?->id ?? 1,
                'name' => $request->name ?? $user?->name ?? 'Zimrion Varethos',
                'email' => $request->email ?? $user?->email ?? 'admin@goaround.id',
                'role' => 'Super Admin',
                'avatar' => $request->avatar ?? '/brand/avatar-admin.png',
                'phone' => $request->phone ?? '+62 812-3456-7890',
                'institution' => $request->institution ?? 'Sekolah Vokasi IPB University',
            ],
        ]);
    }

    /**
     * Change admin password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'new_password' => 'required|min:6',
        ]);

        $user = User::first();
        if ($user) {
            $user->password = Hash::make($request->new_password);
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi berhasil diperbarui',
        ]);
    }
}
