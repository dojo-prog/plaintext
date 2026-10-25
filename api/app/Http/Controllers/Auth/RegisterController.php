<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;


class RegisterController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(RegisterRequest $request): Response
    {
        $validated = $request->validated();

        $nameSlug = Str::slug($validated['name'], '_');
        $count = User::where('username', $nameSlug)->count();
        
        $fbUsername = $count 
            ? "{$nameSlug}_{$count}"
            : $nameSlug; 

        $username = isset($validated['username']) 
            ? $validated['username']
            : $fbUsername;

        $user = User::create([
            ...$validated, 
            'username' => $username,
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        return response()->noContent();
    }
}
