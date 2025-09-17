"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Lightbulb, Palette, Eye, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface RegistrationProcess {
  id: string
  process_type: string
  title: string
  description?: string
  status: string
  inpi_process_number?: string
  priority_date?: string
  publication_date?: string
  total_cost: number
  created_at: string
}

interface ProcessListProps {
  processes: RegistrationProcess[]
}

export default function ProcessList({ processes }: ProcessListProps) {
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
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "published":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  return (
    <div className="space-y-4">
      {processes.map((process) => {
        const Icon = getTypeIcon(process.process_type)
        return (
          <Card key={process.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{process.title}</h3>
                      <Badge className={getStatusColor(process.status)}>{getStatusLabel(process.status)}</Badge>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">
                      {getTypeLabel(process.process_type)} • {process.description || "Sem descrição"}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Criado: {format(new Date(process.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>

                      {process.inpi_process_number && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Nº INPI: {process.inpi_process_number}</span>
                        </div>
                      )}

                      {process.priority_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            Prioridade: {format(new Date(process.priority_date), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>Custo: R$ {Number(process.total_cost).toFixed(2)}</span>
                      </div>
                    </div>

                    {process.publication_date && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          <strong>Publicado em:</strong>{" "}
                          {format(new Date(process.publication_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button asChild size="sm" variant="outline" className="bg-transparent">
                    <Link href={`/processes/${process.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
