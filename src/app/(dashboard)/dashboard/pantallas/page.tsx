"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PantallasPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl" style={{ letterSpacing: "-0.02em" }}>Mis pantallas</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra tus espacios publicitarios</p>
        </div>
        <Link href="/dashboard/pantallas/nueva">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva pantalla
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-12 text-center"
      >
        <Monitor className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="font-heading font-semibold mb-1">No tienes pantallas registradas</h3>
        <p className="text-sm text-muted-foreground mb-4">Agrega tu primer espacio publicitario para comenzar a recibir solicitudes.</p>
        <Link href="/dashboard/pantallas/nueva">
          <Button variant="outline">Agregar pantalla</Button>
        </Link>
      </motion.div>
    </div>
  )
}
