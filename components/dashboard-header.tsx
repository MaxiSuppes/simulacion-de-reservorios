"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Image from "next/image"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/energiar-logo.png" alt="EnergiaAR" width={180} height={50} className="h-10 w-auto" priority />
          <div className="border-l border-border pl-3">
            <h1 className="text-lg font-semibold text-foreground">Dashboard de Producción</h1>
            <p className="text-sm text-muted-foreground">Secretaría de Energía - Argentina</p>
          </div>
        </div>

        {mounted && (
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </header>
  )
}

