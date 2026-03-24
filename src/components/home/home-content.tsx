"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Search,
  MapPin,
  Monitor,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
  Ruler,
  Eye,
  TrendingUp,
  Users,
  Shield,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSearch } from "@/components/search/hero-search"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { formatPrice, formatNumber } from "@/lib/utils"

/* ─── Animation Variants ─── */
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08 },
  },
}

const staggerSlow = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12 },
  },
}

/* ─── Types ─── */
interface FeaturedScreen {
  id: string
  name: string
  slug: string
  format_type: string
  city: string
  zone_neighborhood: string | null
  dimensions_width: number | null
  dimensions_height: number | null
  price_range_min: number | null
  price_range_max: number | null
  price_monthly: number | null
  estimated_traffic: number | null
  traffic_unit: string | null
  availability_status: string
}

interface HomeContentProps {
  featuredScreens: FeaturedScreen[]
  totalScreens: number
  cityCounts: { mexicali: number; tijuana: number }
}

/* ─── Format Labels ─── */
const FORMAT_LABELS: Record<string, string> = {
  billboard: "Espectacular",
  digital: "Pantalla digital",
  mupi: "Mupi",
  indoor_screen: "Pantalla indoor",
  wall: "Muro",
  canvas: "Lona",
  rooftop: "Azotea",
  other: "Otro",
}

/* ─── Static Data ─── */
const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Busca tu espacio",
    description:
      "Explora espectaculares, pantallas digitales y mupis. Filtra por ciudad, zona, formato, precio y disponibilidad.",
  },
  {
    icon: Monitor,
    title: "Compara opciones",
    description:
      "Revisa fotos reales, ubicación en mapa, dimensiones, tráfico estimado y precios. Todo en un solo lugar.",
  },
  {
    icon: Zap,
    title: "Cotiza y contrata",
    description:
      "Envía tu solicitud directo al proveedor. Respuesta rápida para cerrar tu campaña de publicidad exterior.",
  },
]

const OWNER_FEATURES = [
  "Publica tus pantallas en minutos",
  "Recibe solicitudes de anunciantes verificados",
  "Panel de estadísticas y métricas",
  "Sin comisiones por contacto",
]

/* ─── Gradient assignments for cards ─── */
const GRADIENTS = [
  "from-blue-600/20 via-indigo-500/10 to-transparent",
  "from-violet-600/20 via-purple-500/10 to-transparent",
  "from-emerald-600/20 via-teal-500/10 to-transparent",
]

const GLOW_COLORS = [
  "oklch(0.55 0.2 250)",
  "oklch(0.55 0.2 290)",
  "oklch(0.55 0.2 160)",
]

/* ─── Page Component ─── */
export default function HomeContent({ featuredScreens, totalScreens, cityCounts }: HomeContentProps) {
  const cities = [
    {
      name: "Mexicali",
      state: "Baja California",
      screens: cityCounts.mexicali > 0 ? `${cityCounts.mexicali}` : "0",
      slug: "mexicali",
      gradient: "from-primary/80 to-primary/40",
    },
    {
      name: "Tijuana",
      state: "Baja California",
      screens: cityCounts.tijuana > 0 ? `${cityCounts.tijuana}` : "0",
      slug: "tijuana",
      gradient: "from-primary/60 to-indigo-600/40",
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* ━━━ HERO ━━━ */}
      <section className="relative pt-28 pb-24 md:pt-40 md:pb-32">
        {/* Grid background */}
        <div className="absolute inset-0 -z-10 bg-grid" />

        {/* Gradient glow orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl animate-glow-pulse"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.48 0.18 250 / 0.12), oklch(0.55 0.2 280 / 0.06), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl animate-glow-pulse"
            style={{
              background:
                "radial-gradient(circle at center, oklch(0.72 0.17 55 / 0.08), transparent 70%)",
              animationDelay: "1.5s",
            }}
          />
        </div>

        {/* Fade bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent -z-5" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Badge
                variant="secondary"
                className="mb-8 px-4 py-1.5 text-sm font-medium border border-border"
              >
                Marketplace de publicidad exterior en Baja California
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="font-heading font-extrabold text-5xl md:text-7xl leading-[1.05] mb-7"
              style={{ letterSpacing: "-0.03em" }}
            >
              <AnimatedText text="Encuentra el espacio" delay={0.1} />{" "}
              <span className="text-gradient-primary">perfecto</span>{" "}
              <AnimatedText text="para tu marca" delay={0.3} />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Conectamos anunciantes con los mejores espectaculares, pantallas
              digitales y espacios publicitarios en Mexicali y Tijuana.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <HeroSearch />
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-10 md:gap-16 mt-16"
            >
              <div className="flex items-center gap-10 md:gap-16">
                <div className="text-center">
                  <p className="font-heading font-bold text-3xl md:text-4xl text-foreground font-mono">
                    <AnimatedCounter target={totalScreens > 0 ? totalScreens : 0} suffix="+" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Pantallas activas</p>
                </div>
                <div className="w-px h-10 bg-border" />
              </div>
              <div className="flex items-center gap-10 md:gap-16">
                <div className="text-center">
                  <p className="font-heading font-bold text-3xl md:text-4xl text-foreground font-mono">
                    <AnimatedCounter target={2} duration={0.8} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Ciudades</p>
                </div>
                <div className="w-px h-10 bg-border" />
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-3xl md:text-4xl text-foreground font-mono">
                  <AnimatedCounter target={100} duration={1.2} suffix="%" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Verificados</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FEATURED SCREENS ━━━ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-12 pb-4 border-b border-border"
          >
            <div>
              <h2
                className="font-heading font-bold text-2xl md:text-3xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                Espacios destacados
              </h2>
              <p className="text-muted-foreground mt-2">
                Los espacios más populares en Baja California
              </p>
            </div>
            <Link
              href="/buscar"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerSlow}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredScreens.map((screen, i) => {
              const dims = screen.dimensions_width && screen.dimensions_height
                ? `${screen.dimensions_width}x${screen.dimensions_height}m`
                : null
              const traffic = screen.estimated_traffic
                ? `${formatNumber(screen.estimated_traffic)} ${screen.traffic_unit === "vehicles_day" ? "vehículos/día" : "personas/día"}`
                : null
              const priceMin = formatPrice(screen.price_range_min || screen.price_monthly)
              const priceMax = screen.price_range_max ? formatPrice(screen.price_range_max) : null
              const formatLabel = FORMAT_LABELS[screen.format_type] || screen.format_type
              const isAvailable = screen.availability_status === "available"

              return (
                <motion.div
                  key={screen.id}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/pantalla/${screen.slug}`} className="group block">
                    <SpotlightCard className="hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-card)]">
                      {/* Gradient image area */}
                      <div
                        className={"relative h-48 bg-gradient-to-br " + GRADIENTS[i % GRADIENTS.length]}
                      >
                        {/* Decorative shapes */}
                        <div className="absolute inset-0 bg-grid opacity-30" />
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-40"
                          style={{ background: GLOW_COLORS[i % GLOW_COLORS.length] }}
                        />

                        {/* Format badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/30 text-white backdrop-blur-md">
                            {formatLabel}
                          </span>
                        </div>

                        {/* Availability badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md " +
                              (isAvailable
                                ? "bg-emerald-500/20 text-emerald-100"
                                : "bg-red-500/20 text-red-100")
                            }
                          >
                            <span
                              className={
                                "w-1.5 h-1.5 rounded-full " +
                                (isAvailable
                                  ? "bg-emerald-400 animate-pulse-dot"
                                  : "bg-red-400")
                              }
                            />
                            {isAvailable ? "Disponible" : "Ocupado"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-heading font-semibold text-base mb-1 group-hover:text-primary transition-colors truncate">
                          {screen.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {screen.zone_neighborhood ? `${screen.zone_neighborhood}, ` : ""}{screen.city}
                          </span>
                        </div>

                        {/* Specs */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          {dims && (
                            <div className="flex items-center gap-1">
                              <Ruler className="w-3.5 h-3.5" />
                              {dims}
                            </div>
                          )}
                          {traffic && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {traffic}
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono font-bold text-xl text-foreground">
                            {priceMin}
                          </span>
                          {priceMax && (
                            <span className="text-sm text-muted-foreground">
                              — {priceMax}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">/mes</span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/buscar">
              <Button variant="outline" className="w-full">
                Ver todos los espacios
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-24 md:py-32 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="font-heading font-bold text-2xl md:text-3xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Cómo funciona
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              En tres pasos sencillos, encuentra y contrata tu espacio publicitario
              ideal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative"
              >
                {/* Connecting line on desktop */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 right-0 w-full h-px border-t border-dashed border-border/60 translate-x-1/2 z-0" />
                )}

                <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8">
                  {/* Big step number behind */}
                  <div className="relative mb-6">
                    <span
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl font-heading font-extrabold text-gradient-primary opacity-[0.08] select-none pointer-events-none"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      0{i + 1}
                    </span>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
                      <step.icon className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="text-xs font-mono font-semibold text-muted-foreground mb-2 tracking-wider uppercase">
                    Paso {i + 1}
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CITIES ━━━ */}
      <section className="py-24 md:py-32" id="ciudades">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="font-heading font-bold text-2xl md:text-3xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Ciudades disponibles
            </h2>
            <p className="text-muted-foreground mt-3">
              Publicidad exterior en las principales ciudades de Baja California
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {cities.map((city, i) => (
              <motion.div
                key={city.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={"/" + city.slug}
                  className="group relative block rounded-2xl overflow-hidden h-56 md:h-64 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Gradient background */}
                  <div
                    className={"absolute inset-0 bg-gradient-to-br " + city.gradient}
                  />
                  <div className="absolute inset-0 bg-grid opacity-20" />

                  {/* Glow */}
                  <div
                    className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-30"
                    style={{
                      background: "oklch(0.99 0 0 / 0.15)",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                    <Badge
                      variant="secondary"
                      className="self-start mb-3 bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs font-semibold"
                    >
                      {city.screens} pantallas
                    </Badge>
                    <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-1">
                      {city.name}
                    </h3>
                    <p className="text-sm text-white/70">{city.state}</p>

                    <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FOR MEDIA OWNERS CTA ━━━ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.18 250), oklch(0.42 0.2 265))",
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />

            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 p-8 md:p-14 lg:p-16">
              {/* Left: text */}
              <div>
                <h2
                  className="font-heading font-bold text-2xl md:text-4xl text-white leading-tight mb-4"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  ¿Tienes pantallas o espectaculares?
                </h2>
                <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
                  Únete al marketplace y comienza a recibir solicitudes de
                  anunciantes interesados en tus espacios.
                </p>

                <ul className="space-y-3.5 mb-10">
                  {OWNER_FEATURES.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-white/90 text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 rounded-xl"
                  >
                    Empezar gratis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 rounded-xl"
                  >
                    Ver precios
                  </Button>
                </div>
              </div>

              {/* Right: stylized dashboard mockup */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                  {/* Metric cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="text-white/50 text-xs font-medium mb-1">
                        Solicitudes
                      </p>
                      <p className="font-mono font-bold text-2xl text-white">
                        127
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-emerald-300" />
                        <span className="text-xs text-emerald-300">+23%</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="text-white/50 text-xs font-medium mb-1">
                        Vistas
                      </p>
                      <p className="font-mono font-bold text-2xl text-white">
                        2.4k
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-emerald-300" />
                        <span className="text-xs text-emerald-300">+18%</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <p className="text-white/50 text-xs font-medium mb-4">
                      Solicitudes por mes
                    </p>
                    <div className="flex items-end gap-2 h-20">
                      {[35, 52, 40, 65, 48, 72, 85, 60, 90, 78, 95, 88].map(
                        (val, idx) => (
                          <div
                            key={idx}
                            className="flex-1 rounded-sm bg-white/20 hover:bg-white/35 transition-colors"
                            style={{ height: val + "%" }}
                          />
                        )
                      )}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-white/30">Ene</span>
                      <span className="text-[10px] text-white/30">Dic</span>
                    </div>
                  </div>

                  {/* Revenue card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-xs font-medium mb-1">
                          Pantallas activas
                        </p>
                        <p className="font-mono font-bold text-xl text-white">8</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-white/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ TRUST BAR ━━━ */}
      <section className="py-20 md:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2
              className="font-heading font-semibold text-xl md:text-2xl mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Publicidad exterior en Baja California
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-12">
              La plataforma más completa para encontrar y rentar espacios
              publicitarios en el noroeste de México.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14">
              {[
                { icon: Shield, label: "Verificados" },
                { icon: Users, label: "Sin comisiones" },
                { icon: Headphones, label: "Soporte en español" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-heading font-semibold text-sm">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
