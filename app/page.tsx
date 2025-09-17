import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-800">Sistema INPI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/register">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 text-balance">
              Consultas e Registros no INPI Simplificados
            </h1>
            <p className="text-xl text-slate-600 mb-8 text-pretty">
              Gerencie suas marcas, patentes e desenhos industriais com nossa plataforma completa. Consulte, registre e
              acompanhe seus processos de forma eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                <Link href="/auth/register">Começar Agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/auth/login">Fazer Login</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Tudo que você precisa para o INPI</h2>
              <p className="text-lg text-slate-600">
                Uma plataforma completa para gerenciar seus processos de propriedade intelectual
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Consultas Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Consulte marcas, patentes e desenhos industriais no banco de dados do INPI de forma instantânea
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Registro Seguro</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gerencie todo o processo de registro com segurança e acompanhe o status em tempo real
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Cobrança Automática</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sistema de cobrança integrado com controle financeiro completo e relatórios detalhados
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Gestão Completa</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Dashboard completo para acompanhar todos os seus processos e clientes em um só lugar
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Pronto para começar?</h2>
            <p className="text-lg text-slate-600 mb-8">Cadastre-se agora e simplifique seus processos no INPI</p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              <Link href="/auth/register">Criar Conta Gratuita</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">© 2024 Sistema INPI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
