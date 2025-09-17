"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Lightbulb, Palette, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Consultation {
  id: string
  search_term: string
  search_type: string
  status: string
  cost: number
  created_at: string
  results?: any[]
}

interface ConsultationHistoryProps {
  consultations: Consultation[]
}

export default function ConsultationHistory({ consultations }: ConsultationHistoryProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "trademark":
        return FileText
      case "patent":
        return Lightbulb
      case "design":
        return Palette
      default:
        return FileText
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "trademark":
        return "Marca"
      case "patent":
        return "Patente"
      case "design":
        return "Desenho Industrial"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída"
      case "processing":
        return "Processando"
      case "failed":
        return "Falhou"
      default:
        return status
    }
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Nenhuma consulta realizada ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {consultations.map((consultation) => {
        const Icon = getTypeIcon(consultation.search_type)
        return (
          <Card key={consultation.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">{getTypeLabel(consultation.search_type)}</span>
                </div>
                <Badge className={getStatusColor(consultation.status)} variant="secondary">
                  {getStatusLabel(consultation.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-800 font-medium">{consultation.search_term}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {formatDistanceToNow(new Date(consultation.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                  <span>R$ {consultation.cost.toFixed(2)}</span>
                </div>
                {consultation.results && consultation.results.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-600">{consultation.results.length} resultado(s)</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
