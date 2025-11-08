"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, RefreshCw } from "lucide-react"
import { useData } from "@/lib/data-context"

export function FilterPanel() {
  const {
    filters,
    setFilters,
    availableYears,
    availableProvinces,
    availableCompanies,
    availableResourceTypes,
    rawData,
  } = useData()

  if (rawData.length === 0) {
    return null
  }

  const handleReset = () => {
    setFilters({
      anio: null,
      tipoRecurso: null,
      provincia: null,
      empresa: null,
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Año</Label>
          <Select
            value={filters.anio?.toString() || "all"}
            onValueChange={(val) => setFilters({ ...filters, anio: val === "all" ? null : Number.parseInt(val) })}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resource">Tipo de Recurso</Label>
          <Select
            value={filters.tipoRecurso || "all"}
            onValueChange={(val) => setFilters({ ...filters, tipoRecurso: val === "all" ? null : val })}
          >
            <SelectTrigger id="resource">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableResourceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Provincia</Label>
          <Select
            value={filters.provincia || "all"}
            onValueChange={(val) => setFilters({ ...filters, provincia: val === "all" ? null : val })}
          >
            <SelectTrigger id="province">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {availableProvinces.map((prov) => (
                <SelectItem key={prov} value={prov}>
                  {prov}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Select
            value={filters.empresa || "all"}
            onValueChange={(val) => setFilters({ ...filters, empresa: val === "all" ? null : val })}
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {availableCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
          Limpiar Filtros
        </Button>
      </div>
    </Card>
  )
}
