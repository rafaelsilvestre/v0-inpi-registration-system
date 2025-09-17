"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  recordId: string
  amount: number
  description: string
  onSuccess: () => void
}

export default function PaymentModal({ isOpen, onClose, recordId, amount, description, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Selecione um método de pagamento")
      return
    }

    if (paymentMethod === "credit_card" && (!cardNumber || !expiryDate || !cvv || !cardName)) {
      setError("Preencha todos os dados do cartão")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const supabase = createClient()

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const { error: updateError } = await supabase
        .from("billing_records")
        .update({
          status: "paid",
          payment_date: new Date().toISOString(),
          payment_method: paymentMethod,
          invoice_number: `INV-${Date.now()}`,
        })
        .eq("id", recordId)

      if (updateError) throw updateError

      onSuccess()
      onClose()
    } catch (error) {
      setError("Erro ao processar pagamento. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Processar Pagamento
          </DialogTitle>
          <DialogDescription>
            {description} - R$ {amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Nome como está no cartão"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Validade</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "pix" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">Após confirmar, você receberá o código PIX para pagamento.</p>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">Os dados bancários serão enviados por email após a confirmação.</p>
            </div>
          )}

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !paymentMethod}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                `Pagar R$ ${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
