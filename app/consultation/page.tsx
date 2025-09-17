import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ConsultationForm from "@/components/consultation/consultation-form"
import ConsultationHistory from "@/components/consultation/consultation-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ConsultationPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's consultation history
  const { data: consultations } = await supabase
    .from("inpi_consultations")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

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
            <h1 className="text-xl font-bold text-slate-800">Consulta INPI</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Nova Consulta</CardTitle>
                <CardDescription>
                  Pesquise marcas, patentes e desenhos industriais no banco de dados do INPI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConsultationForm userId={data.user.id} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Histórico de Consultas</CardTitle>
                <CardDescription>Suas consultas recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ConsultationHistory consultations={consultations || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
