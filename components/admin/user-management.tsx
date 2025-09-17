"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Building, Calendar, Eye } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  document_type?: string
  document_number?: string
  created_at: string
}

interface UserManagementProps {
  users: UserProfile[]
  isPreview?: boolean
}

export default function UserManagement({ users, isPreview = false }: UserManagementProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Nenhum usuário encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-slate-800">{user.full_name || "Nome não informado"}</h4>
                    {user.document_type && (
                      <Badge variant="secondary" className="text-xs">
                        {user.document_type}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-2" />
                      <span>{user.email}</span>
                    </div>

                    {user.company_name && (
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-2" />
                        <span>{user.company_name}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>Cadastrado em {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {!isPreview && (
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {isPreview && users.length >= 5 && (
        <div className="text-center pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" className="bg-transparent">
            Ver todos os usuários
          </Button>
        </div>
      )}
    </div>
  )
}
