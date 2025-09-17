"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lightbulb, Palette, Loader2, DollarSign } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface NewProcessFormProps {
  userId: string
}

export default function NewProcessForm({ userId }: NewProcessFormProps) {
  const [formData, setFormData] = useState({
    processType: "",
    title: "",
    description: "",
    priorityDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const processTypes = [
    {
      value: "trademark",
      label: "Marca",
      icon: FileText,
      description: "Registro de marca comercial",
      baseCost: 355.0,
    },
    {
      value: "patent",
      label: "Patente",
      icon: Lightbulb,
      description: "Patente de invenção ou modelo de utilidade",
      baseCost: 875.0,
    },
    {
      value: "design",
      label: "Desenho Industrial",
      icon: Palette,
      description: "Registro de desenho industrial",
      baseCost: 180.0,
    },
  ]

  const selectedType = processTypes.find((type) => type.value === formData.processType)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.processType || !formData.title) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const processData = {
        user_id: userId,
        process_type: formData.processType,
        title: formData.title,
        description: formData.description || null,
        status: "draft",
        priority_date: formData.priorityDate || null,
        total_cost: selectedType?.baseCost || 0,
      }

      const { data: process, error: processError } = await supabase
        .from("registration_processes")
        .insert(processData)
        .select()
        .single()

      if (processError) throw processError

      // Create initial monitoring entry
      await supabase.from("process_monitoring").insert({
        process_id: process.id,
        status_change: "Processo criado como rascunho",
        new_status: "draft",
        notes: "Processo iniciado pelo usuário",
      })

      // Create billing record
      await supabase.from("billing_records").insert({
        user_id: userId,
        process_id: process.id,
        service_type: "registration",
        amount: selectedType?.baseCost || 0,
        status: "pending",
      })

      router.push(`/processes/${process.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar processo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="processType" className="text-slate-700">
          Tipo de Processo *
        </Label>
        <Select value={formData.processType} onValueChange={(value) => handleInputChange("processType", value)}>
          <SelectTrigger className="border-slate-300 focus:border-blue-500">
            <SelectValue placeholder="Selecione o tipo de processo" />
          </SelectTrigger>
          <SelectContent>
            {processTypes.map((type) => {
              const Icon = type.icon
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-slate-500">{type.description}</div>
                    </div>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedType && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Custo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600">R$ {selectedType.baseCost.toFixed(2)}</div>
            <p className="text-xs text-blue-600 mt-1">
              Valor base para {selectedType.label.toLowerCase()} (taxas do INPI + honorários)
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="title" className="text-slate-700">
          Título/Nome *
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Ex: Marca da Minha Empresa, Invenção Inovadora, etc."
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="border-slate-300 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-700">
          Descrição
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva brevemente o que será registrado..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="border-slate-300 focus:border-blue-500 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priorityDate" className="text-slate-700">
          Data de Prioridade (opcional)
        </Label>
        <Input
          id="priorityDate"
          type="date"
          value={formData.priorityDate}
          onChange={(e) => handleInputChange("priorityDate", e.target.value)}
          className="border-slate-300 focus:border-blue-500"
        />
        <p className="text-xs text-slate-500">
          Data de prioridade para reivindicação de direitos anteriores (se aplicável)
        </p>
      </div>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

      <div className="flex space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 bg-transparent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.processType || !formData.title}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Processo"
          )}
        </Button>
      </div>
    </form>
  )
}
