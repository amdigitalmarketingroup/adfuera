import { Metadata } from "next"
import Link from "next/link"
import { Search, Monitor, Zap, MapPin, Shield, ArrowRight, Building2, MessageSquare, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: "Aprende cómo encontrar y rentar espacios de publicidad exterior en Mexicali y Tijuana.",
}

const stepsAdvertiser = [
  { icon: Search, title: "Busca", desc: "Explora el catálogo de pantallas, espectaculares y mupis. Filtra por ciudad, formato, precio y disponibilidad." },
  { icon: Monitor, title: "Compara", desc: "Revisa fotos, especificaciones técnicas, ubicación en mapa y tráfico estimado de cada espacio." },
  { icon: Zap, title: "Cotiza", desc: "Envía tu solicitud al proveedor directamente. Sin intermediarios ni comisiones ocultas." },
]

const stepsOwner = [
  { icon: Building2, title: "Regístrate", desc: "Crea tu cuenta gratis en 2 minutos. 30 días de prueba sin tarjeta de crédito." },
  { icon: Monitor, title: "Publica", desc: "Agrega tus pantallas con fotos, ubicación, dimensiones y precios. Todo desde tu panel." },
  { icon: MessageSquare, title: "Recibe leads", desc: "Los anunciantes te contactan directamente. Gestiona solicitudes y cierra contratos." },
]

export default function ComoFuncionaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4" style={{ letterSpacing: "-0.03em" }}>
            Cómo funciona Adfuera
          </h1>
          <p className="text-lg text-muted-foreground">
            Conectamos anunciantes con proveedores de publicidad exterior de manera simple, directa y sin comisiones.
          </p>
        </div>

        {/* For advertisers */}
        <div className="mb-24">
          <h2 className="font-heading font-bold text-xl md:text-2xl mb-2 text-center">Para anunciantes</h2>
          <p className="text-muted-foreground text-center mb-10">Encuentra tu espacio ideal en 3 pasos</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stepsAdvertiser.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Paso {i + 1}</p>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/buscar">
              <Button size="lg" className="gap-2">Buscar espacios <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>

        {/* For owners */}
        <div className="py-16 px-8 rounded-2xl bg-card border border-border">
          <h2 className="font-heading font-bold text-xl md:text-2xl mb-2 text-center">Para proveedores</h2>
          <p className="text-muted-foreground text-center mb-10">Publica tus pantallas y recibe solicitudes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stepsOwner.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Paso {i + 1}</p>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/registro">
              <Button size="lg" variant="outline" className="gap-2">Registrarse gratis <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>

        {/* Trust section */}
        <div className="text-center mt-20">
          <div className="flex items-center justify-center gap-8">
            {[
              { icon: Shield, label: "Proveedores verificados" },
              { icon: MapPin, label: "Mexicali y Tijuana" },
              { icon: BarChart3, label: "Estadísticas reales" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
