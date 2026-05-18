# Frontend GEMINI.md
---

## 1. Project Overview

The frontend is a modern, high-performance eCommerce SaaS dashboard and storefront built with Next.js 15+ and React 19.

* **Tech Stack:**
  * **Framework:** Next.js 15 (App Router)
  * **Library:** React 19
  * **Styling:** Tailwind CSS 4
  * **UI Components:** Shadcn UI + Base UI
  * **Icons:** Hugeicons (@hugeicons/react)
  * **Data Fetching:** TanStack Query (v5)
  * **Validation:** Zod
  * **Toasts:** Sonner
  * **Typography:** Geist Sans, Geist Mono, Inter

---

## 2. Coding Standards

### 2.1 Components

* **Location:** 
  * Reusable UI components: `components/ui/`
  * Business components: `components/`
* **Naming:** Use PascalCase for component files (e.g., `Button.tsx`, `UserCard.tsx`).
* **Composition:** Prefer composition over large, complex components.
* **Purity:** Keep components as pure as possible; move logic to custom hooks.

### 2.2 Styling (Tailwind 4)

* Use Tailwind 4 utility classes for all styling.
* Use `cn()` utility from `lib/utils.ts` for conditional classes.
* Define custom theme colors and variables in `app/globals.css`.
* Follow a mobile-first responsive design approach.

### 2.3 State Management & Data Fetching

* **Server Components:** Use for initial data fetching where possible.
* **TanStack Query:** Use for client-side state, mutations, and caching.
* **Forms:** Use Zod for schema validation. Integrate with TanStack Query for submissions.

### 2.4 Performance

* Use Next.js `Image` component for optimized images.
* Leverage React 19 features like `use` and `Action` where applicable.
* Implement code splitting via dynamic imports for large components.

---

## 3. Architecture Rules

### 3.1 Directory Structure

* `app/`: Routing and layouts (App Router).
* `components/`: React components.
* `lib/`: Shared utilities and configurations.
* `public/`: Static assets.

### 3.2 Tenant Isolation

* The frontend must handle tenant context based on the URL (subdomain or path).
* **Multi-Tenant Middleware**: Located in `middleware.ts`, handles hostname extraction and rewrites to `/[domain]` routes.
* **Storefront Routing**: Dynamic `app/[domain]` structure serves public merchant sites.

---

## 4. Progress Log

* **Dashboard**: Full layout with Sidebar, Topbar, and Mobile-First navigation (completed).
* **Auth**: Simplified Email/Google registration with auto-login and Shadcn styling (completed).
* **Products**: Full CRUD module with tabbed Shadcn UI forms and deep links (completed).
* **Storefront**: Dynamic subdomain-based public shop rendering (completed).
* **Taxonomy**: Categories and Brands management pages (completed).
* **Standardization**: Full app refactor to use Shadcn UI components consistently (completed).

---

## 5. Final Rule

> **Deliver a visually stunning, responsive, and type-safe user experience.**
