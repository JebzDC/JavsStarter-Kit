<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        Cache::forget('spatie.permission.cache');

        // Create permissions (admin + post-related)
        $permissions = [
            'manage users',
            'manage roles',
            'manage permissions',
            
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $allPermissions = Permission::all();

        // Super-admin: all permissions (also bypassed via Gate::before)
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdminRole->syncPermissions($allPermissions);

        // Admin: all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($allPermissions);

        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $editorRole->syncPermissions([]);

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->syncPermissions([]);

        // Assign super-admin role to the first user (Super Admin account)
        $firstUser = User::first();
        if ($firstUser && ! $firstUser->hasRole('super-admin')) {
            $firstUser->assignRole('super-admin');
        }
    }
}
