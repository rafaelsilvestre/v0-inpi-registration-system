import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import BillingOverview from "@/components/billing/billing-overview"
import InvoiceList from "@/components/billing/invoice-list"
import PaymentHistory from "@/components/billing/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function BillingPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get billing records
  const { data: billingRecords } = await supabase
    .from("billing_records")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Calculate totals
  const totalPending =
    billingRecords
      ?.filter((record) => record.status === "pending")
      .reduce((sum, record) => sum + Number(record.amount), 0) || 0
  const totalPaid =
    billingRecords
      ?.filter((record) => record.status === "paid")
      .reduce((sum, record) => sum + Number(record.amount), 0) || 0
  const totalAmount = billingRecords?.reduce((sum, record) => sum + Number(record.amount), 0) || 0

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button asChild variant="ghost" size="sm" className="mr-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-slate-800">Cobrança e Pagamentos</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Pendente</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ {totalPending.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Aguardando pagamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Pago</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalPaid.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Pagamentos realizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {totalAmount.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Valor total dos serviços</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Faturas Pendentes</CardTitle>
                <CardDescription>Faturas aguardando pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceList
                  records={billingRecords?.filter((record) => record.status === "pending") || []}
                  showPayButton={true}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Histórico de Pagamentos</CardTitle>
                <CardDescription>Pagamentos realizados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentHistory records={billingRecords?.filter((record) => record.status === "paid") || []} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <BillingOverview records={billingRecords || []} />
        </div>
      </main>
    </div>
  )
}
