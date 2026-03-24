"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  MapPin, LayoutDashboard, Monitor, MessageSquare,
  Building2, CreditCard, ChevronLeft, LogOut, Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pantallas", href: "/dashboard/pantallas", icon: Monitor },
  { label: "Solicitudes", href: "/dashboard/solicitudes", icon: MessageSquare },
  { label: "Perfil", href: "/dashboard/perfil", icon: Building2 },
  { label: "Suscripción", href: "/dashboard/cuenta", icon: CreditCard },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col ${collapsed ? "w-[68px]" : "w-[260px]"} transition-all duration-300 bg-[oklch(0.18_0.04_260)] text-white shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-base tracking-tight">
              Ad<span className="text-primary">fuera</span>
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {sidebarItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Collapse + Logout */}
        <div className="px-2 pb-4 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 w-full transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && "Colapsar"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && "Cerrar sesión"}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[oklch(0.18_0.04_260)] flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/70">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-heading font-bold text-white text-sm">Adfuera</span>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            className="relative w-[260px] h-full bg-[oklch(0.18_0.04_260)] p-4 pt-16"
          >
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active ? "bg-primary text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:pt-0 pt-14">
        <div className="p-6 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
