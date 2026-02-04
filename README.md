# JavsStarter-Kit

<p align="center">
  <img src="https://laravel.com/img/logomark.min.svg" alt="Laravel" width="48" height="48" />
  <img src="https://inertiajs.com/img/logo.svg" alt="Inertia.js" width="48" height="48" />
  <img src="https://react.dev/favicon.svg" alt="React" width="48" height="48" />
</p>

**Laravel + Inertia + React (TypeScript)** starter kit. A high-performance, type-safe boilerplate for modern web apps. Includes pre-configured Auth, security best practices, and clean architecture. Workable, secure, and ready to clone.

*Licensed under MIT – Maintained by Javes Cordova.*

---

## Clone the project

```bash
git clone https://github.com/jabsstarterkit/JavsStarter-Kit.git
cd JavsStarter-Kit
```

---

## How to use it in your project

### 1. Install PHP and Node dependencies

```bash
composer install
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Configure your `.env` (database, mail, etc.) as needed.

### 3. Database

```bash
php artisan migrate
php artisan db:seed
```

### 4. Run the app

**Option A – Vite and Laravel together (recommended):**

```bash
npm run dev:full
```

**Option B – Separate terminals:**

```bash
# Terminal 1
npm run dev

# Terminal 2
php artisan serve
```

Then open **http://localhost:8000** (or the URL shown by `php artisan serve`).

### 5. Build for production

```bash
npm run build
```

---

## Using the JavsStarter Kit: Sidebar and components

### Sidebar

The app uses a collapsible sidebar built from:

- **`AppSidebar`** (`resources/js/components/app-sidebar.tsx`) – Main sidebar: logo, nav items, footer.
- **`NavMain`** (`resources/js/components/nav-main.tsx`) – Renders the list of nav links from a `NavItem[]`.
- **`AppSidebarLayout`** (`resources/js/layouts/app/app-sidebar-layout.tsx`) – Layout that wraps pages with `AppShell` (sidebar variant), `AppSidebar`, and `AppSidebarHeader`.

#### Adding sidebar items

Edit `mainNavItems` in `app-sidebar.tsx`. Each item is a `NavItem`:

```ts
// resources/js/types/navigation.ts
type NavItem = {
  title: string;
  href: string;  // Inertia/Wayfinder route
  icon?: LucideIcon | null;
  isActive?: boolean;
};
```

**Example – add a new sidebar link:**

```tsx
// In app-sidebar.tsx
const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
  { title: 'Create User', href: createUser(), icon: BookOpen },
  { title: 'Create Roles', href: createRoles(), icon: Folder },
  { title: 'Your Page', href: yourRoute(), icon: YourIcon },
];
```

Use Wayfinder route helpers (e.g. `dashboard()`, `createUser()`) from `@/routes` so links stay type-safe. Items can be shown conditionally with `canPermission()` (e.g. only show “Create User” when the user has the right permission).

#### Using the sidebar layout on a page

Use `AppSidebarLayout` so the page gets the sidebar and header:

```tsx
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

export default function YourPage() {
  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Home', href: '/' }, { title: 'Your Page', href: '/your-page' }]}>
      <div>{/* Your page content */}</div>
    </AppSidebarLayout>
  );
}
```

`breadcrumbs` are passed to `AppSidebarHeader` for the top breadcrumb bar.

---

### Key components

| Component | Path | Purpose |
|----------|------|--------|
| **AppShell** | `components/app-shell.tsx` | Wraps the app; use `variant="sidebar"` for sidebar layout. |
| **AppSidebar** | `components/app-sidebar.tsx` | Sidebar: logo, `NavMain`, footer. Define `mainNavItems` here. |
| **AppSidebarHeader** | `components/app-sidebar-header.tsx` | Top bar with breadcrumbs and mobile menu trigger. |
| **AppSidebarLayout** | `layouts/app/app-sidebar-layout.tsx` | Full layout: sidebar + content area + header. Use this for “sidebar pages”. |
| **NavMain** | `components/nav-main.tsx` | Renders sidebar menu from `items` (`NavItem[]`). |
| **AppHeader** | `components/app-header.tsx` | Header for non-sidebar layouts (e.g. auth pages). |
| **AppLogo** | `components/app-logo.tsx` | Logo and app name in sidebar; customize branding here. |
| **AppContent** | `components/app-content.tsx` | Main content wrapper (used inside `AppSidebarLayout`). |

### UI building blocks

Reusable UI lives under `resources/js/components/ui/`: `sidebar`, `button`, `card`, `input`, `dialog`, `dropdown-menu`, etc. Use these in your pages and in the sidebar components to keep the look consistent.

### Permissions in the sidebar

The sidebar uses `useAuthPermissions()` and `canPermission()`. Example from `app-sidebar.tsx`:

```tsx
const { canPermission } = useAuthPermissions();

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
  ...(canPermission('manage users') ? [{ title: 'Create User', href: createUser(), icon: BookOpen }] : []),
  ...(canPermission('manage roles') ? [{ title: 'Create Roles', href: createRoles(), icon: Folder }] : []),
];
```

Add or remove permissions in the same way to control which sidebar links each user sees.

---

## Tech stack

- **Laravel** – Backend, auth (Fortify), API
- **Inertia.js** – SPA-like experience without a separate API
- **React** (TypeScript) – UI and components
- **Wayfinder** – Type-safe Laravel routes in TypeScript
- **Tailwind CSS** – Styling
- **Radix UI** – Accessible primitives (sidebar, dialogs, etc.)
- **Lucide** – Icons
