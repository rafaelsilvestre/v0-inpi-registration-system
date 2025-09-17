import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">Verifique seu Email</CardTitle>
            <CardDescription className="text-slate-600">Confirme sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta e fazer login.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Não recebeu o email? Verifique sua caixa de spam.</p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Voltar para Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
