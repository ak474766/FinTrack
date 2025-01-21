import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calculator, TrendingUp, Ban, InfoIcon } from 'lucide-react'

const riskProfiles = {
  conservative: [
    { name: 'Debt Fund', expectedReturn: 6.5, risk: 'Low', description: 'Suitable for capital preservation and stable returns' },
    { name: 'Balanced Advantage Fund', expectedReturn: 8.0, risk: 'Low-Medium', description: 'Dynamic allocation between equity and debt' }
  ],
  moderate: [
    { name: 'Hybrid Equity Fund', expectedReturn: 10.0, risk: 'Medium', description: 'Balanced mix of equity and debt investments' },
    { name: 'Large Cap Fund', expectedReturn: 12.0, risk: 'Medium-High', description: 'Investment in established large companies' }
  ],
  aggressive: [
    { name: 'Mid Cap Fund', expectedReturn: 14.0, risk: 'High', description: 'Focus on growing medium-sized companies' },
    { name: 'Small Cap Fund', expectedReturn: 16.0, risk: 'Very High', description: 'Investment in smaller emerging companies' }
  ]
}

interface SIPResult {
  fundName: string
  expectedReturn: number
  risk: string
  description: string
  calculation: {
    totalInvested: number
    totalInterest: number
    totalValue: number
    monthlyValue: number
  }
}

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('5000')
  const [years, setYears] = useState<string>('5')
  const [riskProfile, setRiskProfile] = useState<keyof typeof riskProfiles>('moderate')
  const [results, setResults] = useState<SIPResult[]>([])
  const [error, setError] = useState<string>('')
  const [isCalculating, setIsCalculating] = useState(false)

  const validateInputs = (): boolean => {
    const investment = Number(monthlyInvestment)
    const duration = Number(years)

    if (isNaN(investment) || investment <= 0) {
      setError('Please enter a valid monthly investment amount')
      return false
    }
    if (investment > 1000000) {
      setError('Monthly investment seems unusually high. Please verify.')
      return false
    }
    if (isNaN(duration) || duration <= 0) {
      setError('Please enter a valid investment duration')
      return false
    }
    if (duration > 30) {
      setError('Maximum investment duration is 30 years')
      return false
    }
    setError('')
    return true
  }

  const calculateSIPReturns = (monthlyInvestment: number, years: number, interestRate: number) => {
    const monthlyRate = interestRate / 1200 // Convert annual rate to monthly
    const totalMonths = years * 12
    const totalInvested = monthlyInvestment * totalMonths

    // Using the SIP compound interest formula
    const monthlyValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
      (1 + monthlyRate)

    const totalValue = Math.round(monthlyValue)
    const totalInterest = Math.round(totalValue - totalInvested)

    return {
      totalInvested: Math.round(totalInvested),
      totalInterest,
      totalValue,
      monthlyValue: Math.round(monthlyValue / totalMonths)
    }
  }

  const calculateSIP = () => {
    if (!validateInputs()) return

    setIsCalculating(true)
    try {
      const recommendations = riskProfiles[riskProfile].map(fund => {
        const calculation = calculateSIPReturns(
          Number(monthlyInvestment),
          Number(years),
          fund.expectedReturn
        )
        return {
          fundName: fund.name,
          expectedReturn: fund.expectedReturn,
          risk: fund.risk,
          description: fund.description,
          calculation
        }
      })
      setResults(recommendations)
    } catch (err) {
      setError('An error occurred during calculation. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  const getChartData = () => {
    return results.map(result => ({
      name: result.fundName,
      'Total Invested': result.calculation.totalInvested,
      'Expected Returns': result.calculation.totalValue,
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          SIP Calculator
        </CardTitle>
        <CardDescription>
          Calculate your potential returns with Systematic Investment Plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Investment</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (Years)</label>
            <Input
              type="number"
              placeholder="Enter years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Profile</label>
            <Select 
              value={riskProfile}
              onValueChange={(value: keyof typeof riskProfiles) => setRiskProfile(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateSIP} 
          className="w-full"
          disabled={isCalculating}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Returns'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <Ban className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{result.fundName}</h4>
                        <p className="text-sm text-gray-500">{result.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Expected Return</div>
                        <div className="text-lg text-blue-600">{result.expectedReturn}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Total Investment</div>
                        <div className="font-semibold">
                          {formatCurrency(result.calculation.totalInvested)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Expected Returns</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(result.calculation.totalInterest)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Total Value</div>
                        <div className="font-semibold text-lg">
                          {formatCurrency(result.calculation.totalValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Monthly Value</div>
                        <div className="font-semibold">
                          {formatCurrency(result.calculation.monthlyValue)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <InfoIcon className="w-4 h-4 text-blue-600" />
                      <span>Risk Level: <span className="font-medium">{result.risk}</span></span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="h-[400px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="Total Invested" fill="#4BC0C0" />
                  <Bar dataKey="Expected Returns" fill="#9966FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

