export interface ProductionData {
  idempresa: string
  anio: number
  mes: number
  idpozo: string
  prod_pet: number
  prod_gas: number
  prod_agua: number
  empresa: string
  provincia: string
  tipo_de_recurso: string
  cuenca: string
  formacion: string
  fecha_data: string
}

export interface ProcessedData {
  totalProduction: number
  monthlyChange: number
  activeCompanies: number
  activeProvinces: number
  monthlyTimeSeries: Array<{ date: string; petroleo: number; gas: number }>
  productionByProvince: Array<{ provincia: string; produccion: number }>
  productionByCompany: Array<{ empresa: string; produccion: number }>
  filteredData: ProductionData[]
}

export function parseCSV(csvText: string): ProductionData[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",")

  const data: ProductionData[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    if (values.length < headers.length) continue

    const row: any = {}
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || ""
    })

    data.push({
      idempresa: row.idempresa || "",
      anio: Number.parseInt(row.anio) || 0,
      mes: Number.parseInt(row.mes) || 0,
      idpozo: row.idpozo || "",
      prod_pet: Number.parseFloat(row.prod_pet) || 0,
      prod_gas: Number.parseFloat(row.prod_gas) || 0,
      prod_agua: Number.parseFloat(row.prod_agua) || 0,
      empresa: row.empresa || "",
      provincia: row.provincia || "",
      tipo_de_recurso: row.tipo_de_recurso || "",
      cuenca: row.cuenca || "",
      formacion: row.formacion || "",
      fecha_data: row.fecha_data || "",
    })
  }

  return data
}

export function processData(
  data: ProductionData[],
  filters: {
    anio?: number | null
    tipoRecurso?: string | null
    provincia?: string | null
    empresa?: string | null
  },
): ProcessedData {
  let filtered = [...data]

  if (filters.anio) {
    filtered = filtered.filter((d) => d.anio === filters.anio)
  }
  if (filters.tipoRecurso && filters.tipoRecurso !== "Todos") {
    filtered = filtered.filter((d) => d.tipo_de_recurso === filters.tipoRecurso)
  }
  if (filters.provincia && filters.provincia !== "Todas") {
    filtered = filtered.filter((d) => d.provincia === filters.provincia)
  }
  if (filters.empresa && filters.empresa !== "Todas") {
    filtered = filtered.filter((d) => d.empresa === filters.empresa)
  }

  // Calculate total production (petróleo en m3 + gas en miles de m3 convertido a m3)
  const totalProduction = filtered.reduce((sum, d) => sum + d.prod_pet + d.prod_gas * 1000, 0)

  // Calculate monthly change
  const currentMonth = filtered.filter((d) => d.mes === Math.max(...filtered.map((x) => x.mes)))
  const previousMonth = filtered.filter((d) => d.mes === Math.max(...filtered.map((x) => x.mes)) - 1)
  const currentTotal = currentMonth.reduce((sum, d) => sum + d.prod_pet + d.prod_gas * 1000, 0)
  const previousTotal = previousMonth.reduce((sum, d) => sum + d.prod_pet + d.prod_gas * 1000, 0)
  const monthlyChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  // Count active companies and provinces
  const activeCompanies = new Set(filtered.map((d) => d.empresa)).size
  const activeProvinces = new Set(filtered.map((d) => d.provincia)).size

  // Monthly time series
  const monthlyMap = new Map<string, { petroleo: number; gas: number }>()
  filtered.forEach((d) => {
    const key = `${d.anio}-${String(d.mes).padStart(2, "0")}`
    const current = monthlyMap.get(key) || { petroleo: 0, gas: 0 }
    monthlyMap.set(key, {
      petroleo: current.petroleo + d.prod_pet,
      gas: current.gas + d.prod_gas,
    })
  })

  const monthlyTimeSeries = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, values]) => ({ date, ...values }))

  // Production by province
  const provinceMap = new Map<string, number>()
  filtered.forEach((d) => {
    const current = provinceMap.get(d.provincia) || 0
    provinceMap.set(d.provincia, current + d.prod_pet + d.prod_gas * 1000)
  })

  const productionByProvince = Array.from(provinceMap.entries())
    .map(([provincia, produccion]) => ({ provincia, produccion }))
    .sort((a, b) => b.produccion - a.produccion)
    .slice(0, 10)

  // Production by company
  const companyMap = new Map<string, number>()
  filtered.forEach((d) => {
    const current = companyMap.get(d.empresa) || 0
    companyMap.set(d.empresa, current + d.prod_pet + d.prod_gas * 1000)
  })

  const productionByCompany = Array.from(companyMap.entries())
    .map(([empresa, produccion]) => ({ empresa, produccion }))
    .sort((a, b) => b.produccion - a.produccion)
    .slice(0, 10)

  return {
    totalProduction,
    monthlyChange,
    activeCompanies,
    activeProvinces,
    monthlyTimeSeries,
    productionByProvince,
    productionByCompany,
    filteredData: filtered,
  }
}
