'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calculator, CreditCard, AlertTriangle, Info } from 'lucide-react'

interface LoanDetails {
  amount: number
  interest: number
  tenure: number
  type: string
}

interface EMICalculation {
  emi: number
  totalInterest: number
  totalPayment: number
  amortizationSchedule: Array<{
    month: number
    emi: number
    principal: number
    interest: number
    balance: number
  }>
}

export default function LoanManager() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    amount: 0,
    interest: 0,
    tenure: 0,
    type: 'home'
  })
  const [calculation, setCalculation] = useState<EMICalculation | null>(null)
  const [error, setError] = useState<string>('')

  const calculateEMI = () => {
    if (!validateInputs()) return

    const { amount, interest, tenure } = loanDetails
    const monthlyRate = interest / 1200
    const months = tenure * 12

    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1)

    const amortizationSchedule = []
    let balance = amount
    let totalInterest = 0

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = emi - interestPayment
      balance -= principalPayment
      totalInterest += interestPayment

      amortizationSchedule.push({
        month,
        emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      })
    }

    setCalculation({
      emi,
      totalInterest,
      totalPayment: emi * months,
      amortizationSchedule
    })
  }

  const validateInputs = (): boolean => {
    if (!loanDetails.amount || loanDetails.amount <= 0) {
      setError('Please enter a valid loan amount')
      return false
    }
    if (!loanDetails.interest || loanDetails.interest <= 0 || loanDetails.interest > 30) {
      setError('Please enter a valid interest rate between 0 and 30')
      return false
    }
    if (!loanDetails.tenure || loanDetails.tenure <= 0 || loanDetails.tenure > 30) {
      setError('Please enter a valid loan tenure between 0 and 30 years')
      return false
    }
    setError('')
    return true
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Loan & EMI Calculator
        </CardTitle>
        <CardDescription>
          Calculate EMI and view complete loan amortization schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Amount</label>
            <Input
              type="number"
              placeholder="Enter loan amount"
              value={loanDetails.amount || ''}
              onChange={(e) => setLoanDetails({ ...loanDetails, amount: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Interest Rate (%)</label>
            <Input
              type="number"
              placeholder="Enter interest rate"
              value={loanDetails.interest || ''}
              onChange={(e) => setLoanDetails({ ...loanDetails, interest: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tenure (Years)</label>
            <Input
              type="number"
              placeholder="Enter loan tenure"
              value={loanDetails.tenure || ''}
              onChange={(e) => setLoanDetails({ ...loanDetails, tenure: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Type</label>
            <Select
              value={loanDetails.type}
              onValueChange={(value) => setLoanDetails({ ...loanDetails, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Loan</SelectItem>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="car">Car Loan</SelectItem>
                <SelectItem value="education">Education Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateEMI} className="w-full">Calculate EMI</Button>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {calculation && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Monthly EMI</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculation.emi)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Total Interest</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(calculation.totalInterest)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Total Payment</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculation.totalPayment)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amortization Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={calculation.amortizationSchedule}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="principal" stroke="#4BC0C0" name="Principal" />
                      <Line type="monotone" dataKey="interest" stroke="#FF6384" name="Interest" />
                      <Line type="monotone" dataKey="balance" stroke="#9966FF" name="Balance" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

