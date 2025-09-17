import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import UserManagement from "@/components/admin/user-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Users, Download } from "lucide-react"
import Link from "next/link"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  if (!data.user.email?.includes("admin")) {
    redirect("/dashboard")
  }

  // Get all users with their consultation and process counts
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const { data: consultationCounts } = await supabase.from("inpi_consultations").select("user_id").order("user_id")

  const { data: processCounts } = await supabase.from("registration_processes").select("user_id").order("user_id")

  // Count consultations and processes per user
  const userStats = users?.map((user) => ({
    ...user,
    consultationCount: consultationCounts?.filter((c) => c.user_id === user.id).length || 0,
    processCount: processCounts?.filter((p) => p.user_id === user.id).length || 0,
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar Lista
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Buscar Usuários
            </CardTitle>
            <CardDescription>Encontre usuários por nome, email ou empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input placeholder="Buscar por nome, email ou empresa..." className="flex-1" />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{users?.length || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Usuários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userStats?.filter((u) => u.consultationCount > 0 || u.processCount > 0).length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Com atividade no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Empresas</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {users?.filter((u) => u.document_type === "CNPJ").length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Usuários pessoa jurídica</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pessoas Físicas</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {users?.filter((u) => u.document_type === "CPF").length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Usuários pessoa física</p>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Lista de Usuários</CardTitle>
            <CardDescription>Todos os usuários cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagement users={userStats || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
