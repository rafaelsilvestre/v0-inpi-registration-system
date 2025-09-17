"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ProcessMonitoring {
  id: string
  status_change: string
  previous_status?: string
  new_status: string
  notes?: string
  created_at: string
  registration_processes: {
    title: string
    process_type: string
  }
}

interface ProcessTimelineProps {
  monitoring: ProcessMonitoring[]
}

export default function ProcessTimeline({ monitoring }: ProcessTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "published":
        return CheckCircle
      case "rejected":
        return XCircle
      case "under_review":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "published":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      case "under_review":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho"
      case "submitted":
        return "Submetido"
      case "under_review":
        return "Em Análise"
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      case "published":
        return "Publicado"
      default:
        return status
    }
  }

  if (monitoring.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Nenhuma atividade recente</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {monitoring.map((item, index) => {
        const Icon = getStatusIcon(item.new_status)
        const isLast = index === monitoring.length - 1

        return (
          <div key={item.id} className="relative">
            {!isLast && <div className="absolute left-4 top-8 w-0.5 h-16 bg-slate-200" />}

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-white border-2 ${getStatusColor(item.new_status)} border-current`}>
                <Icon className={`h-4 w-4 ${getStatusColor(item.new_status)}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-slate-800 truncate">{item.registration_processes.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {getStatusLabel(item.new_status)}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 mb-2">
                  {item.status_change}
                  {item.previous_status && (
                    <span className="text-slate-500">
                      {" "}
                      • De "{getStatusLabel(item.previous_status)}" para "{getStatusLabel(item.new_status)}"
                    </span>
                  )}
                </p>

                {item.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border mb-2">{item.notes}</p>
                )}

                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </div>
        )
      })}

      {monitoring.length >= 10 && (
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">Mostrando as 10 atividades mais recentes</p>
        </div>
      )}
    </div>
  )
}
