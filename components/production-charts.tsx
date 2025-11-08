"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { useData } from "@/lib/data-context"

export function ProductionCharts() {
  const { processedData, rawData } = useData()

  if (!processedData || rawData.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Producción Mensual</CardTitle>
          <CardDescription>Evolución de la producción de gas y petróleo (m³)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line" className="w-full">
            <TabsList>
              <TabsTrigger value="line">Líneas</TabsTrigger>
              <TabsTrigger value="area">Área</TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData.monthlyTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="petroleo"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Petróleo (m³)"
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gas"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Gas (m³)"
                    dot={{ fill: "hsl(var(--chart-1))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="area" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData.monthlyTimeSeries}>
                  <defs>
                    <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPetroleo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="petroleo"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorPetroleo)"
                    name="Petróleo (m³)"
                  />
                  <Area
                    type="monotone"
                    dataKey="gas"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorGas)"
                    name="Gas (m³)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Producción por Empresa</CardTitle>
          <CardDescription>Top 10 productores</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.productionByCompany} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                type="category"
                dataKey="empresa"
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Bar dataKey="produccion" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Producción (m³)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Producción por Provincia</CardTitle>
          <CardDescription>Top 10 provincias productoras</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.productionByProvince}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="provincia" className="text-xs" stroke="hsl(var(--muted-foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Bar dataKey="produccion" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Producción (m³)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
