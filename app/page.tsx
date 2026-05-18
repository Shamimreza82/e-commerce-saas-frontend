import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-tighter">
          E-COM<span className="text-zinc-500">SAAS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="font-bold shadow-lg">Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Launch your store in <span className="text-zinc-500 underline decoration-zinc-300">minutes</span>.
          </h1>
          <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            The all-in-one eCommerce platform for modern merchants in Bangladesh. 
            Manage products, tracking orders, and grow your brand with ease.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Create Your Store
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid Placeholder */}
        <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-3 max-w-5xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Multi-Tenant Safety</h3>
            <p className="text-zinc-500">Secure, isolated store environments for every merchant.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-zinc-500">Built with Next.js 15 and Tailwind 4 for peak performance.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Local First</h3>
            <p className="text-zinc-500">Tailored for the Bangladeshi market with local currency and timezones.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} E-COM SAAS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
