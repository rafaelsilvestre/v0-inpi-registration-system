"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, FileText, DollarSign, TrendingUp, Clock } from "lucide-react"
import { subDays, isAfter } from "date-fns"

interface AdminStatsProps {
  users: any[]
  consultations: any[]
  processes: any[]
  billing: any[]
}

export default function AdminStats({ users, consultations, processes, billing }: AdminStatsProps) {
  const totalUsers = users.length
  const totalConsultations = consultations.length
  const totalProcesses = processes.length
  const totalRevenue = billing.reduce((sum, record) => sum + Number(record.amount), 0)

  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = subDays(new Date(), 7)
  const newUsersThisWeek = users.filter((user) => isAfter(new Date(user.created_at), sevenDaysAgo)).length
  const newConsultationsThisWeek = consultations.filter((consultation) =>
    isAfter(new Date(consultation.created_at), sevenDaysAgo),
  ).length
  const newProcessesThisWeek = processes.filter((process) => isAfter(new Date(process.created_at), sevenDaysAgo)).length
  const revenueThisWeek = billing
    .filter((record) => isAfter(new Date(record.created_at), sevenDaysAgo))
    .reduce((sum, record) => sum + Number(record.amount), 0)

  // Calculate active processes
  const activeProcesses = processes.filter((process) => ["submitted", "under_review"].includes(process.status)).length

  // Calculate pending payments
  const pendingPayments = billing.filter((record) => record.status === "pending").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total de Usuários</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
          <p className="text-xs text-slate-500 mt-1">+{newUsersThisWeek} esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Consultas</CardTitle>
          <Search className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalConsultations}</div>
          <p className="text-xs text-slate-500 mt-1">+{newConsultationsThisWeek} esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Processos</CardTitle>
          <FileText className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{totalProcesses}</div>
          <p className="text-xs text-slate-500 mt-1">+{newProcessesThisWeek} esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">R$ {totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-slate-500 mt-1">+R$ {revenueThisWeek.toFixed(2)} esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Processos Ativos</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{activeProcesses}</div>
          <p className="text-xs text-slate-500 mt-1">Em análise ou submetidos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Pagamentos Pendentes</CardTitle>
          <TrendingUp className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{pendingPayments}</div>
          <p className="text-xs text-slate-500 mt-1">Aguardando pagamento</p>
        </CardContent>
      </Card>
    </div>
  )
}
