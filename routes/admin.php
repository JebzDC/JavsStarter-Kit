<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    // Users Management – requires "manage users" permission
    Route::middleware('can:manage users')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    });

    // Roles Management – requires "manage roles" permission
    Route::middleware('can:manage roles')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('admin.roles.index');
        Route::post('roles', [RoleController::class, 'store'])->name('admin.roles.store');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('admin.roles.destroy');
    });

    // Permissions Management – requires "manage permissions" permission
    Route::middleware('can:manage permissions')->group(function () {
        Route::get('permissions', [PermissionController::class, 'index'])->name('admin.permissions.index');
        Route::post('permissions', [PermissionController::class, 'store'])->name('admin.permissions.store');
        Route::put('permissions/{permission}', [PermissionController::class, 'update'])->name('admin.permissions.update');
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('admin.permissions.destroy');
    });
});
