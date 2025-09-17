"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface BillingRecord {
  id: string
  service_type: string
  amount: number
  status: string
  created_at: string
  payment_date?: string
  payment_method?: string
  invoice_number?: string
}

interface PaymentHistoryProps {
  records: BillingRecord[]
}

export default function PaymentHistory({ records }: PaymentHistoryProps) {
  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "consultation":
        return "Consulta INPI"
      case "registration":
        return "Registro"
      case "monitoring":
        return "Monitoramento"
      default:
        return type
    }
  }

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito"
      case "debit_card":
        return "Cartão de Débito"
      case "bank_transfer":
        return "Transferência Bancária"
      case "pix":
        return "PIX"
      default:
        return "Não informado"
    }
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Nenhum pagamento realizado ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.slice(0, 10).map((record) => (
        <Card key={record.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{getServiceTypeLabel(record.service_type)}</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {record.invoice_number ? `Fatura #${record.invoice_number}` : `ID: ${record.id.slice(0, 8)}`}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {record.payment_date
                          ? format(new Date(record.payment_date), "dd/MM/yyyy", { locale: ptBR })
                          : format(new Date(record.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      <span>{getPaymentMethodLabel(record.payment_method)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-green-600">R$ {Number(record.amount).toFixed(2)}</div>
                <Badge className="bg-green-100 text-green-800 mt-1">Pago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {records.length > 10 && (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">Mostrando os 10 pagamentos mais recentes de {records.length} total</p>
        </div>
      )}
    </div>
  )
}
