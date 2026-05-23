import Link from "next/link"

const navLinks = [
  { href: "/festivais", label: "Festivais" },
  { href: "/atracoes", label: "Atrações" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-secondary"
        >
          Cajá
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-secondary/80">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
