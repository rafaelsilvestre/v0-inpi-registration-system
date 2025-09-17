"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"

interface RegistrationProcess {
  id: string
  process_type: string
  status: string
  total_cost: number
  created_at: string
}

interface ProcessStatsProps {
  processes: RegistrationProcess[]
}

export default function ProcessStats({ processes }: ProcessStatsProps) {
  const totalProcesses = processes.length
  const draftProcesses = processes.filter((p) => p.status === "draft").length
  const activeProcesses = processes.filter((p) => ["submitted", "under_review"].includes(p.status)).length
  const completedProcesses = processes.filter((p) => ["approved", "published"].includes(p.status)).length
  const rejectedProcesses = processes.filter((p) => p.status === "rejected").length

  const totalInvestment = processes.reduce((sum, process) => sum + Number(process.total_cost), 0)

  const trademarkCount = processes.filter((p) => p.process_type === "trademark").length
  const patentCount = processes.filter((p) => p.process_type === "patent").length
  const designCount = processes.filter((p) => p.process_type === "design").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total de Processos</CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalProcesses}</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-green-600">{trademarkCount} marcas</span> •{" "}
            <span className="text-orange-600">{patentCount} patentes</span> •{" "}
            <span className="text-purple-600">{designCount} desenhos</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Em Andamento</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{activeProcesses}</div>
          <p className="text-xs text-slate-500 mt-1">
            {draftProcesses} rascunho(s) • {activeProcesses - draftProcesses} submetido(s)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Concluídos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedProcesses}</div>
          <p className="text-xs text-slate-500 mt-1">
            {totalProcesses > 0 ? ((completedProcesses / totalProcesses) * 100).toFixed(1) : 0}% de sucesso
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Rejeitados</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{rejectedProcesses}</div>
          <p className="text-xs text-slate-500 mt-1">
            {totalProcesses > 0 ? ((rejectedProcesses / totalProcesses) * 100).toFixed(1) : 0}% rejeitados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Investimento Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">R$ {totalInvestment.toFixed(2)}</div>
          <p className="text-xs text-slate-500 mt-1">
            Média: R$ {totalProcesses > 0 ? (totalInvestment / totalProcesses).toFixed(2) : "0.00"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
