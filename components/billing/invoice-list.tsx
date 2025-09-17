"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, FileText, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BillingRecord {
  id: string
  service_type: string
  amount: number
  status: string
  created_at: string
  invoice_number?: string
}

interface InvoiceListProps {
  records: BillingRecord[]
  showPayButton?: boolean
}

export default function InvoiceList({ records, showPayButton = false }: InvoiceListProps) {
  const [payingInvoices, setPayingInvoices] = useState<Set<string>>(new Set())
  const router = useRouter()

  const handlePayment = async (recordId: string) => {
    setPayingInvoices((prev) => new Set(prev).add(recordId))

    try {
      const supabase = createClient()

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update payment status
      const { error } = await supabase
        .from("billing_records")
        .update({
          status: "paid",
          payment_date: new Date().toISOString(),
          payment_method: "credit_card",
        })
        .eq("id", recordId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setPayingInvoices((prev) => {
        const newSet = new Set(prev)
        newSet.delete(recordId)
        return newSet
      })
    }
  }

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

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return FileText
      case "registration":
        return FileText
      case "monitoring":
        return Calendar
      default:
        return FileText
    }
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Nenhuma fatura encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const Icon = getServiceTypeIcon(record.service_type)
        const isPaying = payingInvoices.has(record.id)

        return (
          <Card key={record.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{getServiceTypeLabel(record.service_type)}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {record.invoice_number ? `Fatura #${record.invoice_number}` : `ID: ${record.id.slice(0, 8)}`}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span>{format(new Date(record.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                      <span className="font-semibold text-slate-800">R$ {Number(record.amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge
                    variant={record.status === "paid" ? "default" : "secondary"}
                    className={
                      record.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : record.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {record.status === "paid" ? "Pago" : record.status === "pending" ? "Pendente" : "Falhou"}
                  </Badge>

                  {showPayButton && record.status === "pending" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handlePayment(record.id)}
                      disabled={isPaying}
                    >
                      {isPaying ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-3 w-3 mr-1" />
                          Pagar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
