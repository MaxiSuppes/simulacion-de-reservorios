"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Factory, MapPin } from "lucide-react"
import { useData } from "@/lib/data-context"

export function MetricsOverview() {
  const { processedData, rawData } = useData()

  if (!processedData || rawData.length === 0) {
    return null
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(num)
  }

  const metrics = [
    {
      title: "Producción Total",
      value: formatNumber(processedData.totalProduction / 1_000_000),
      unit: "Millones m³",
      change: `${processedData.monthlyChange > 0 ? "+" : ""}${formatNumber(processedData.monthlyChange)}%`,
      trend: processedData.monthlyChange >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: "Empresas Activas",
      value: processedData.activeCompanies.toString(),
      unit: "empresas",
      change: "",
      trend: "neutral",
      icon: Factory,
    },
    {
      title: "Provincias",
      value: processedData.activeProvinces.toString(),
      unit: "provincias",
      change: "",
      trend: "neutral",
      icon: MapPin,
    },
    {
      title: "Pozos en Dataset",
      value: formatNumber(processedData.filteredData.length),
      unit: "registros",
      change: "",
      trend: "neutral",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isPositive = metric.trend === "up"
        const isNegative = metric.trend === "down"
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <Card key={metric.title} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                {metric.change && (
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`h-4 w-4 ${isPositive ? "text-chart-3" : "text-destructive"}`} />
                    <span className={`text-sm font-medium ${isPositive ? "text-chart-3" : "text-destructive"}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs mes anterior</span>
                  </div>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
