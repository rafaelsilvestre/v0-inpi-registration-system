"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

interface BillingRecord {
  id: string
  service_type: string
  amount: number
  status: string
  created_at: string
}

interface BillingOverviewProps {
  records: BillingRecord[]
}

export default function BillingOverview({ records }: BillingOverviewProps) {
  // Prepare monthly data for the last 6 months
  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    const monthRecords = records.filter((record) => {
      const recordDate = new Date(record.created_at)
      return recordDate >= monthStart && recordDate <= monthEnd
    })

    const totalAmount = monthRecords.reduce((sum, record) => sum + Number(record.amount), 0)
    const paidAmount = monthRecords
      .filter((record) => record.status === "paid")
      .reduce((sum, record) => sum + Number(record.amount), 0)

    monthlyData.push({
      month: format(date, "MMM", { locale: ptBR }),
      total: totalAmount,
      paid: paidAmount,
      pending: totalAmount - paidAmount,
    })
  }

  // Prepare service type data
  const serviceTypeData = records.reduce(
    (acc, record) => {
      const type = record.service_type
      const amount = Number(record.amount)

      if (!acc[type]) {
        acc[type] = { name: getServiceTypeLabel(type), value: 0, count: 0 }
      }

      acc[type].value += amount
      acc[type].count += 1

      return acc
    },
    {} as Record<string, { name: string; value: number; count: number }>,
  )

  const pieData = Object.values(serviceTypeData)

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  function getServiceTypeLabel(type: string) {
    switch (type) {
      case "consultation":
        return "Consultas"
      case "registration":
        return "Registros"
      case "monitoring":
        return "Monitoramento"
      default:
        return type
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Faturamento Mensal</CardTitle>
          <CardDescription>Evolução dos valores nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, ""]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="paid" stackId="a" fill="#10B981" name="Pago" />
              <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pendente" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Distribuição por Serviço</CardTitle>
          <CardDescription>Faturamento por tipo de serviço</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 mt-4 lg:mt-0 lg:ml-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-slate-600">
                    {entry.name}: {entry.count} serviço(s)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
