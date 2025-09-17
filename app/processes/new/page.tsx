import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NewProcessForm from "@/components/processes/new-process-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewProcessPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button asChild variant="ghost" size="sm" className="mr-4">
              <Link href="/processes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-slate-800">Novo Processo de Registro</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Iniciar Processo de Registro</CardTitle>
            <CardDescription>Preencha as informações para iniciar seu processo de registro no INPI</CardDescription>
          </CardHeader>
          <CardContent>
            <NewProcessForm userId={data.user.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
