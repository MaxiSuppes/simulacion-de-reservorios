"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { ProductionCharts } from "@/components/production-charts"
import { FilterPanel } from "@/components/filter-panel"
import { DataTable } from "@/components/data-table"
import { DataProvider } from "@/lib/data-context"
import { CSVLoader } from "@/components/csv-loader"

export default function Home() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6 space-y-6">
          <CSVLoader />
          <div className="flex flex-col gap-6">
            <FilterPanel />
            <MetricsOverview />
            <ProductionCharts />
            <DataTable />
          </div>
        </main>
      </div>
    </DataProvider>
  )
}
