"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useState } from "react"

export function DataTable() {
  const { processedData, rawData } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 20

  if (!processedData || rawData.length === 0) {
    return null
  }

  const filteredData = processedData.filteredData.filter(
    (row) =>
      row.idpozo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.provincia.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIdx = (currentPage - 1) * rowsPerPage
  const endIdx = startIdx + rowsPerPage
  const paginatedData = filteredData.slice(startIdx, endIdx)

  const handleExport = () => {
    const headers = [
      "ID Pozo",
      "Empresa",
      "Provincia",
      "Formación",
      "Producción Petróleo (m³)",
      "Producción Gas (m³)",
      "Año",
      "Mes",
    ]
    const csv = [
      headers.join(","),
      ...filteredData.map((row) =>
        [row.idpozo, row.empresa, row.provincia, row.formacion, row.prod_pet, row.prod_gas, row.anio, row.mes].join(
          ",",
        ),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "produccion_hidrocarburos.csv"
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Datos de Producción por Pozo</CardTitle>
            <CardDescription>Detalle de producción individual filtrado</CardDescription>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, empresa, provincia..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pozo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Formación</TableHead>
                <TableHead className="text-right">Petróleo (m³)</TableHead>
                <TableHead className="text-right">Gas (m³)</TableHead>
                <TableHead>Período</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={`${row.idpozo}-${idx}`}>
                  <TableCell className="font-mono font-medium">{row.idpozo}</TableCell>
                  <TableCell>{row.empresa}</TableCell>
                  <TableCell>{row.provincia}</TableCell>
                  <TableCell>{row.formacion}</TableCell>
                  <TableCell className="text-right font-mono">{row.prod_pet.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono">{row.prod_gas.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{`${row.anio}-${String(row.mes).padStart(2, "0")}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIdx + 1}-{Math.min(endIdx, filteredData.length)} de {filteredData.length} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="flex items-center px-3 text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
