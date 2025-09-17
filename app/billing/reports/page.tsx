import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, TrendingUp, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { format, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function BillingReportsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get billing records for the last 12 months
  const twelveMonthsAgo = subMonths(new Date(), 12)
  const { data: billingRecords } = await supabase
    .from("billing_records")
    .select("*")
    .eq("user_id", data.user.id)
    .gte("created_at", twelveMonthsAgo.toISOString())
    .order("created_at", { ascending: false })

  // Calculate statistics
  const totalRevenue = billingRecords?.reduce((sum, record) => sum + Number(record.amount), 0) || 0
  const paidRevenue =
    billingRecords?.filter((r) => r.status === "paid").reduce((sum, record) => sum + Number(record.amount), 0) || 0
  const pendingRevenue =
    billingRecords?.filter((r) => r.status === "pending").reduce((sum, record) => sum + Number(record.amount), 0) || 0

  const consultationCount = billingRecords?.filter((r) => r.service_type === "consultation").length || 0
  const registrationCount = billingRecords?.filter((r) => r.service_type === "registration").length || 0
  const monitoringCount = billingRecords?.filter((r) => r.service_type === "monitoring").length || 0

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link href="/billing">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-slate-800">Relatórios Financeiros</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Últimos 12 meses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Receita Paga</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {paidRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">
                {totalRevenue > 0 ? ((paidRevenue / totalRevenue) * 100).toFixed(1) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pendente</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ {pendingRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Aguardando pagamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Serviços</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{billingRecords?.length || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Serviços contratados</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Breakdown por Serviço</CardTitle>
              <CardDescription>Distribuição dos serviços contratados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800">Consultas INPI</h4>
                    <p className="text-sm text-slate-600">{consultationCount} consulta(s)</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">
                      R${" "}
                      {(
                        billingRecords
                          ?.filter((r) => r.service_type === "consultation")
                          .reduce((sum, r) => sum + Number(r.amount), 0) || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800">Registros</h4>
                    <p className="text-sm text-slate-600">{registrationCount} registro(s)</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      R${" "}
                      {(
                        billingRecords
                          ?.filter((r) => r.service_type === "registration")
                          .reduce((sum, r) => sum + Number(r.amount), 0) || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800">Monitoramento</h4>
                    <p className="text-sm text-slate-600">{monitoringCount} serviço(s)</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-600">
                      R${" "}
                      {(
                        billingRecords
                          ?.filter((r) => r.service_type === "monitoring")
                          .reduce((sum, r) => sum + Number(r.amount), 0) || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Resumo do Período</CardTitle>
              <CardDescription>Análise dos últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Período analisado:</span>
                  <span className="font-medium">
                    {format(twelveMonthsAgo, "MMM/yyyy", { locale: ptBR })} -{" "}
                    {format(new Date(), "MMM/yyyy", { locale: ptBR })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Taxa de pagamento:</span>
                  <span className="font-medium text-green-600">
                    {totalRevenue > 0 ? ((paidRevenue / totalRevenue) * 100).toFixed(1) : 0}%
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Ticket médio:</span>
                  <span className="font-medium">
                    R$ {billingRecords?.length ? (totalRevenue / billingRecords.length).toFixed(2) : "0.00"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Serviços por mês:</span>
                  <span className="font-medium">
                    {billingRecords?.length ? (billingRecords.length / 12).toFixed(1) : "0.0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
