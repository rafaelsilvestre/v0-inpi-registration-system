import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Settings, Save, Database, Mail, Shield } from "lucide-react"
import Link from "next/link"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  if (!data.user.email?.includes("admin")) {
    redirect("/dashboard")
  }

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
              <h1 className="text-xl font-bold text-slate-800">Configurações do Sistema</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Configurações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input id="systemName" defaultValue="Sistema INPI" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemVersion">Versão</Label>
                  <Input id="systemVersion" defaultValue="1.0.0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemDescription">Descrição</Label>
                <Textarea
                  id="systemDescription"
                  defaultValue="Sistema completo para consultas e registros no INPI"
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="maintenanceMode" />
                <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
              </div>
            </CardContent>
          </Card>

          {/* INPI Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Integração INPI
              </CardTitle>
              <CardDescription>Configurações da API do INPI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inpiApiUrl">URL da API INPI</Label>
                  <Input id="inpiApiUrl" placeholder="https://api.inpi.gov.br" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inpiApiKey">Chave da API</Label>
                  <Input id="inpiApiKey" type="password" placeholder="••••••••••••••••" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="consultationCost">Custo Consulta Marca (R$)</Label>
                  <Input id="consultationCost" type="number" defaultValue="25.00" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patentCost">Custo Consulta Patente (R$)</Label>
                  <Input id="patentCost" type="number" defaultValue="50.00" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designCost">Custo Consulta Desenho (R$)</Label>
                  <Input id="designCost" type="number" defaultValue="35.00" step="0.01" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="inpiIntegration" defaultChecked />
                <Label htmlFor="inpiIntegration">Integração INPI Ativa</Label>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Configurações de Email
              </CardTitle>
              <CardDescription>Configurações para envio de emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input id="smtpPort" type="number" defaultValue="587" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Email Remetente</Label>
                  <Input id="emailFrom" type="email" placeholder="noreply@sistema-inpi.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailPassword">Senha do Email</Label>
                  <Input id="emailPassword" type="password" placeholder="••••••••••••••••" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="emailNotifications" defaultChecked />
                <Label htmlFor="emailNotifications">Notificações por Email</Label>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>Configurações de segurança e acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactorAuth" />
                  <Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="passwordComplexity" defaultChecked />
                  <Label htmlFor="passwordComplexity">Exigir Senhas Complexas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auditLog" defaultChecked />
                  <Label htmlFor="auditLog">Log de Auditoria</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
