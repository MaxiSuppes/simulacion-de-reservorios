"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { LinkIcon, Loader2 } from "lucide-react"

export function CSVLoader() {
  const { loadCSV, loadFromURL, isLoading, rawData } = useData()
  const [url, setUrl] = useState("")
  const [loadedSample, setLoadedSample] = useState(false)

  useEffect(() => {
    if (rawData.length === 0 && !loadedSample && !isLoading) {
      setLoadedSample(true)
      loadFromURL("/produccion-data.csv")
    }
  }, [rawData.length, loadedSample, isLoading, loadFromURL])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        loadCSV(text)
      }
      reader.readAsText(file)
    }
  }

  const handleLoadFromURL = () => {
    if (url) {
      loadFromURL(url)
    }
  }

  if (isLoading && rawData.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando datos de producción...</p>
        </div>
      </Card>
    )
  }

  if (rawData.length > 0) {
    return (
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-3 animate-pulse" />
            <p className="text-sm font-medium">
              Dashboard activo - {rawData.length.toLocaleString("es-AR")} registros cargados
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="max-w-[200px] h-9"
            />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Cargar Datos de Producción</h2>
          <p className="text-sm text-muted-foreground">Cargue un archivo CSV local o desde una URL</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cargar archivo CSV</label>
            <div className="flex gap-2">
              <Input type="file" accept=".csv" onChange={handleFileUpload} disabled={isLoading} className="flex-1" />
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cargar desde URL</label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://datos.energia.gob.ar/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleLoadFromURL} disabled={!url || isLoading} size="icon">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            URL de ejemplo:
            https://datos.energia.gob.ar/dataset/c846e79c-026c-4040-897f-1ad3543b407c/archivo/d774b5d7-0756-48fe-88f2-8729b57b22da
          </p>
        </div>
      </div>
    </Card>
  )
}
