"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Buscar espacios", href: "/buscar" },
  { label: "Ciudades", href: "#ciudades" },
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Precios", href: "/precios" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "py-2.5 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
            <MapPin className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-foreground">
            Ad<span className="text-primary">fuera</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/5 ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={`font-medium transition-all duration-300 ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/registro">
            <Button
              size="sm"
              className="font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Publicar pantalla
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
            scrolled
              ? "hover:bg-accent text-foreground"
              : "hover:bg-white/10 text-white"
          }`}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-background/95 backdrop-blur-xl border-l border-border/50 z-50 p-6 shadow-2xl md:hidden"
            >
              <div className="flex justify-end mb-10">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3.5 text-base font-medium rounded-xl hover:bg-primary/5 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-border/50 my-5" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-center rounded-xl h-11 font-medium">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/registro" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full justify-center rounded-xl h-11 font-medium bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20">
                      Publicar pantalla
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
