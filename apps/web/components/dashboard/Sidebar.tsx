"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/clients", label: "Clients", icon: "👥" },
  { href: "/setup", label: "Booking Page", icon: "🔗" },
  { href: "/payments", label: "Payments", icon: "💳" },
  { href: "/reviews", label: "Reviews", icon: "⭐" },
  { href: "/import", label: "Import", icon: "📥" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Get initials from email for the avatar
  const initials = userEmail
    ? userEmail.charAt(0).toUpperCase()
    : "?";

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow border-r bg-white pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white font-display text-sm font-semibold">
            S
          </div>
          <span className="text-xl font-bold text-[#2C2C2C]">
            SlotSync
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-coral-50 text-[#D4846A]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-gray-100 px-3 pt-4 mt-2">
          <div className="flex items-center gap-3 px-3 py-2">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {initials}
            </div>
            {/* Email (truncated) */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {userEmail || "Loading..."}
              </p>
              <p className="text-[10px] text-gray-400">Business Owner</p>
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
