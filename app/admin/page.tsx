import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminStats from "@/components/admin/admin-stats"
import RecentActivity from "@/components/admin/recent-activity"
import UserManagement from "@/components/admin/user-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, FileText, DollarSign, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin (in a real app, you'd have proper role checking)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile || !data.user.email?.includes("admin")) {
    redirect("/dashboard")
  }

  // Get admin statistics
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const { data: consultations } = await supabase
    .from("inpi_consultations")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: processes } = await supabase
    .from("registration_processes")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: billing } = await supabase.from("billing_records").select("*").order("created_at", { ascending: false })

  const { data: monitoring } = await supabase
    .from("process_monitoring")
    .select("*, registration_processes!inner(title, user_id, profiles!inner(full_name))")
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-slate-800">Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Voltar ao Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Statistics */}
        <div className="mb-8">
          <AdminStats
            users={users || []}
            consultations={consultations || []}
            processes={processes || []}
            billing={billing || []}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-sm">Gerenciar Usuários</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/users">Ver Usuários</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-sm">Processos</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href="/admin/processes">Gerenciar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-sm">Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href="/admin/billing">Ver Relatórios</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-sm">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href="/admin/analytics">Ver Dados</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Atividade Recente</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity monitoring={monitoring || []} />
            </CardContent>
          </Card>

          {/* User Management Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Usuários Recentes</CardTitle>
              <CardDescription>Últimos usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement users={(users || []).slice(0, 5)} isPreview={true} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
