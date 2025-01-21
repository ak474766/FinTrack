'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Info, AlertTriangle, TrendingUp, Wallet, Shield, Target } from 'lucide-react'

const riskProfiles = {
  conservative: {
    'Fixed Deposits': { allocation: 0.4, description: 'Low-risk, stable returns', expectedReturn: '6-7%', riskLevel: 'Low' },
    'Government Bonds': { allocation: 0.3, description: 'Safe, backed by government', expectedReturn: '7-8%', riskLevel: 'Low' },
    'Blue Chip Stocks': { allocation: 0.2, description: 'Stable, large-cap companies', expectedReturn: '10-12%', riskLevel: 'Medium' },
    'Gold': { allocation: 0.1, description: 'Hedge against inflation', expectedReturn: '8-10%', riskLevel: 'Medium' }
  },
  moderate: {
    'Mutual Funds': { allocation: 0.35, description: 'Diversified portfolio managed by experts', expectedReturn: '12-15%', riskLevel: 'Medium' },
    'Index Funds': { allocation: 0.25, description: 'Low-cost way to track market performance', expectedReturn: '10-12%', riskLevel: 'Medium' },
    'Corporate Bonds': { allocation: 0.25, description: 'Higher yields than government bonds', expectedReturn: '8-10%', riskLevel: 'Medium' },
    'Stocks': { allocation: 0.15, description: 'Potential for higher returns', expectedReturn: '15-18%', riskLevel: 'High' }
  },
  aggressive: {
    'Stocks': { allocation: 0.45, description: 'High growth potential', expectedReturn: '15-20%', riskLevel: 'High' },
    'International Funds': { allocation: 0.25, description: 'Exposure to global markets', expectedReturn: '12-15%', riskLevel: 'High' },
    'Small Cap Funds': { allocation: 0.20, description: 'Higher risk, higher reward potential', expectedReturn: '18-22%', riskLevel: 'Very High' },
    'Crypto': { allocation: 0.10, description: 'Highly volatile, potential for significant returns', expectedReturn: '20-30%', riskLevel: 'Very High' }
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface Suggestion {
  amount: number
  description: string
  expectedReturn: string
  riskLevel: string
}

export default function InvestmentPlanner() {
  const [amount, setAmount] = useState<string>('')
  const [riskProfile, setRiskProfile] = useState<keyof typeof riskProfiles>('moderate')
  const [suggestions, setSuggestions] = useState<Record<string, Suggestion> | null>(null)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState('plan')

  const validateAmount = (value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue)) {
      setError('Please enter a valid number')
      return false
    }
    if (numValue < 1000) {
      setError('Minimum investment amount is ₹1,000')
      return false
    }
    if (numValue > 10000000) {
      setError('For investments above ₹1 Crore, please contact our advisors')
      return false
    }
    setError('')
    return true
  }

  const getInvestmentSuggestions = () => {
    if (!validateAmount(amount)) return

    const numAmount = Number(amount)
    const allocation = riskProfiles[riskProfile]
    const result = Object.fromEntries(
      Object.entries(allocation).map(([instrument, { allocation, description, expectedReturn, riskLevel }]) => [
        instrument,
        {
          amount: numAmount * allocation,
          description,
          expectedReturn,
          riskLevel
        }
      ])
    )
    setSuggestions(result)
    setActiveTab('suggestions')
  }

  const getChartData = () => {
    if (!suggestions) return []
    return Object.entries(suggestions).map(([name, { amount }]) => ({
      name,
      value: amount
    }))
  }

  const calculateTotalReturns = () => {
    if (!suggestions) return null
    
    const returns = {
      conservative: { min: 0.06, max: 0.08 },
      moderate: { min: 0.10, max: 0.14 },
      aggressive: { min: 0.14, max: 0.20 }
    }

    const numAmount = Number(amount)
    const { min, max } = returns[riskProfile]
    
    return {
      oneYear: {
        min: numAmount * (1 + min),
        max: numAmount * (1 + max)
      },
      fiveYears: {
        min: numAmount * Math.pow(1 + min, 5),
        max: numAmount * Math.pow(1 + max, 5)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto py-8">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Investment Planner
                </CardTitle>
                <CardDescription className="mt-2">
                  Plan your investments based on your risk tolerance and goals
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg">
                <Shield className="w-4 h-4 mr-1" />
                {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} Risk
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="plan">Plan</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="plan">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Investment Amount</label>
                          <Input
                            type="number"
                            placeholder="Enter amount (min ₹1,000)"
                            value={amount}
                            onChange={(e) => {
                              setAmount(e.target.value)
                              validateAmount(e.target.value)
                            }}
                            className="bg-white"
                          />
                          {error && (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Risk Profile</label>
                          <Select value={riskProfile} onValueChange={(value: keyof typeof riskProfiles) => setRiskProfile(value)}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Risk Profile" />
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
                        onClick={getInvestmentSuggestions}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        disabled={!!error || !amount}
                      >
                        Generate Investment Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions">
                {suggestions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Allocation Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getChartData()}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {getChartData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => `₹${value.toLocaleString()}`}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Investment Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(suggestions).map(([instrument, { amount, description, expectedReturn, riskLevel }]) => (
                            <div key={instrument} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{instrument}</h4>
                                <Badge variant={
                                  riskLevel === 'Low' ? 'secondary' :
                                  riskLevel === 'Medium' ? 'outline' :
                                  'destructive'
                                }>
                                  {riskLevel}
                                </Badge>
                              </div>
                              <p className="text-lg font-medium">₹{amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{description}</p>
                              <p className="text-sm text-blue-600">Expected Return: {expectedReturn}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis">
                {suggestions && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Potential Returns Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {(() => {
                          const returns = calculateTotalReturns()
                          if (!returns) return null

                          return (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Projected 1 Year Returns</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <p className="text-2xl font-bold text-green-600">
                                        ₹{returns.oneYear.min.toLocaleString()} - ₹{returns.oneYear.max.toLocaleString()}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Potential growth: {((returns.oneYear.min/Number(amount) - 1) * 100).toFixed(1)}% - {((returns.oneYear.max/Number(amount) - 1) * 100).toFixed(1)}%
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Projected 5 Year Returns</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <p className="text-2xl font-bold text-green-600">
                                        ₹{returns.fiveYears.min.toLocaleString()} - ₹{returns.fiveYears.max.toLocaleString()}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Potential growth: {((returns.fiveYears.min/Number(amount) - 1) * 100).toFixed(1)}% - {((returns.fiveYears.max/Number(amount) - 1) * 100).toFixed(1)}%
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                  These projections are based on historical data and market assumptions. Actual returns may vary.
                                  Past performance is not indicative of future results.
                                </AlertDescription>
                              </Alert>
                            </>
                          )
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

