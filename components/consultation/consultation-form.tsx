"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, FileText, Lightbulb, Palette } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ConsultationFormProps {
  userId: string
}

interface SearchResult {
  id: string
  title: string
  status: string
  number: string
  applicant: string
  class?: string
  type: string
}

export default function ConsultationForm({ userId }: ConsultationFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const searchTypeOptions = [
    { value: "trademark", label: "Marca", icon: FileText, description: "Pesquisar marcas registradas" },
    { value: "patent", label: "Patente", icon: Lightbulb, description: "Pesquisar patentes de invenção" },
    { value: "design", label: "Desenho Industrial", icon: Palette, description: "Pesquisar desenhos industriais" },
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim() || !searchType) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      const supabase = createClient()

      // Simulate INPI API call with mock data
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: searchTerm.toUpperCase(),
          status: "Ativo",
          number:
            "BR" +
            Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(6, "0"),
          applicant: "EMPRESA EXEMPLO LTDA",
          class: searchType === "trademark" ? "35" : undefined,
          type: searchType,
        },
        {
          id: "2",
          title: searchTerm.toUpperCase() + " PLUS",
          status: "Em análise",
          number:
            "BR" +
            Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(6, "0"),
          applicant: "OUTRA EMPRESA S.A.",
          class: searchType === "trademark" ? "42" : undefined,
          type: searchType,
        },
      ]

      // Calculate cost based on search type
      const cost = searchType === "trademark" ? 25.0 : searchType === "patent" ? 50.0 : 35.0

      // Save consultation to database
      const { error: dbError } = await supabase.from("inpi_consultations").insert({
        user_id: userId,
        search_term: searchTerm,
        search_type: searchType,
        status: "completed",
        results: mockResults,
        cost: cost,
      })

      if (dbError) throw dbError

      setResults(mockResults)

      // Create billing record
      await supabase.from("billing_records").insert({
        user_id: userId,
        service_type: "consultation",
        amount: cost,
        status: "pending",
      })

      // Refresh the page to update history
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao realizar consulta")
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    const option = searchTypeOptions.find((opt) => opt.value === type)
    if (!option) return FileText
    return option.icon
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "em análise":
        return "bg-yellow-100 text-yellow-800"
      case "indeferido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="searchType" className="text-slate-700">
              Tipo de Consulta
            </Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {searchTypeOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchTerm" className="text-slate-700">
              Termo de Busca
            </Label>
            <Input
              id="searchTerm"
              type="text"
              placeholder="Digite o nome ou número"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

        <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Consultando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Consultar INPI
            </>
          )}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Resultados da Consulta</h3>
            <Badge variant="secondary">{results.length} resultado(s) encontrado(s)</Badge>
          </div>

          <div className="space-y-3">
            {results.map((result) => {
              const Icon = getTypeIcon(result.type)
              return (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{result.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">Requerente: {result.applicant}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                            <span>Nº: {result.number}</span>
                            {result.class && <span>Classe: {result.class}</span>}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">Consulta realizada com sucesso</h4>
                  <p className="text-sm text-blue-600">
                    Custo da consulta: R${" "}
                    {searchType === "trademark" ? "25,00" : searchType === "patent" ? "50,00" : "35,00"}
                  </p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Iniciar Registro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
