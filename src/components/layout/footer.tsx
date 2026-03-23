import Link from "next/link"
import { MapPin } from "lucide-react"

const footerLinks = {
  producto: [
    { label: "Buscar espacios", href: "/buscar" },
    { label: "Ciudades", href: "#ciudades" },
    { label: "Precios", href: "/precios" },
    { label: "Cómo funciona", href: "/como-funciona" },
  ],
  ciudades: [
    { label: "Mexicali", href: "/mexicali" },
    { label: "Tijuana", href: "/tijuana" },
  ],
  legal: [
    { label: "Términos de uso", href: "/terminos" },
    { label: "Privacidad", href: "/privacidad" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Pantallas<span className="text-primary">MX</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El marketplace de publicidad exterior más grande de Baja California.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Producto</h4>
            <ul className="space-y-2.5">
              {footerLinks.producto.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Ciudades</h4>
            <ul className="space-y-2.5">
              {footerLinks.ciudades.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pantallas MX. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho en Baja California, México
          </p>
        </div>
      </div>
    </footer>
  )
}
