import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProcessList from "@/components/processes/process-list"
import ProcessStats from "@/components/processes/process-stats"
import ProcessTimeline from "@/components/processes/process-timeline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, FileText } from "lucide-react"
import Link from "next/link"

export default async function ProcessesPage() {
  const supabase = await createClient()

  console.log("[v0] Starting ProcessesPage - checking user authentication")

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    console.log("[v0] User not authenticated, redirecting to login", error)
    redirect("/auth/login")
  }

  console.log("[v0] User authenticated:", data.user.id)

  // Get user's registration processes with error handling
  console.log("[v0] Fetching registration processes for user:", data.user.id)
  const { data: processes, error: processesError } = await supabase
    .from("registration_processes")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  if (processesError) {
    console.log("[v0] Error fetching processes:", processesError)
  } else {
    console.log("[v0] Processes fetched successfully:", processes?.length || 0)
  }

  // Get process monitoring data with error handling
  console.log("[v0] Fetching process monitoring data")
  const { data: monitoring, error: monitoringError } = await supabase
    .from("process_monitoring")
    .select("*, registration_processes!inner(*)")
    .eq("registration_processes.user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (monitoringError) {
    console.log("[v0] Error fetching monitoring data:", monitoringError)
  } else {
    console.log("[v0] Monitoring data fetched successfully:", monitoring?.length || 0)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-slate-800">Processos de Registro</h1>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/processes/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="mb-8">
          <ProcessStats processes={processes || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Process List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Meus Processos</CardTitle>
                <CardDescription>Acompanhe o status dos seus registros no INPI</CardDescription>
              </CardHeader>
              <CardContent>
                {processesError ? (
                  <div className="text-center py-12 text-red-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Erro ao carregar processos</h3>
                    <p className="text-sm mb-6">Ocorreu um erro ao buscar seus processos. Tente novamente.</p>
                    <Button asChild variant="outline">
                      <Link href="/processes">Tentar Novamente</Link>
                    </Button>
                  </div>
                ) : processes && processes.length > 0 ? (
                  <ProcessList processes={processes} />
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhum processo encontrado</h3>
                    <p className="text-sm mb-6">Você ainda não iniciou nenhum processo de registro.</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/processes/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Iniciar Primeiro Processo
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Atividades Recentes</CardTitle>
                <CardDescription>Últimas atualizações dos processos</CardDescription>
              </CardHeader>
              <CardContent>
                {monitoringError ? (
                  <div className="text-center py-8 text-red-500">
                    <p className="text-sm">Erro ao carregar atividades</p>
                  </div>
                ) : (
                  <ProcessTimeline monitoring={monitoring || []} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
