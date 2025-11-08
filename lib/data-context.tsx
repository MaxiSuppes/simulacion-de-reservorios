"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { type ProductionData, type ProcessedData, parseCSV, processData } from "./data-processor"

interface DataContextType {
  rawData: ProductionData[]
  processedData: ProcessedData | null
  filters: {
    anio: number | null
    tipoRecurso: string | null
    provincia: string | null
    empresa: string | null
  }
  setFilters: (filters: any) => void
  loadCSV: (csvText: string) => void
  loadFromURL: (url: string) => Promise<void>
  isLoading: boolean
  error: string | null
  availableYears: number[]
  availableProvinces: string[]
  availableCompanies: string[]
  availableResourceTypes: string[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<ProductionData[]>([])
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    anio: null as number | null,
    tipoRecurso: null as string | null,
    provincia: null as string | null,
    empresa: null as string | null,
  })

  const availableYears = Array.from(new Set(rawData.map((d) => d.anio))).sort((a, b) => b - a)
  const availableProvinces = Array.from(new Set(rawData.map((d) => d.provincia)))
    .filter(Boolean)
    .sort()
  const availableCompanies = Array.from(new Set(rawData.map((d) => d.empresa)))
    .filter(Boolean)
    .sort()
  const availableResourceTypes = Array.from(new Set(rawData.map((d) => d.tipo_de_recurso)))
    .filter(Boolean)
    .sort()

  const loadCSV = useCallback((csvText: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const parsed = parseCSV(csvText)
      setRawData(parsed)
      setIsLoading(false)
    } catch (err) {
      setError("Error al cargar el CSV")
      setIsLoading(false)
    }
  }, [])

  const loadFromURL = useCallback(async (url: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(url)
      const text = await response.text()
      const parsed = parseCSV(text)
      setRawData(parsed)
      setIsLoading(false)
    } catch (err) {
      setError("Error al cargar desde URL")
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (rawData.length > 0) {
      const processed = processData(rawData, filters)
      setProcessedData(processed)
    }
  }, [rawData, filters])

  return (
    <DataContext.Provider
      value={{
        rawData,
        processedData,
        filters,
        setFilters,
        loadCSV,
        loadFromURL,
        isLoading,
        error,
        availableYears,
        availableProvinces,
        availableCompanies,
        availableResourceTypes,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
