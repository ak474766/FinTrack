import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Wallet, TrendingUp, PiggyBank, CreditCard, ShoppingBag, Home } from "lucide-react"

// Enhanced background pattern SVG
const backgroundSvg = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="circles" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle cx="50" cy="50" r="40" fill="#f0f0f0" fillOpacity="0.4"/>
      <circle cx="0" cy="0" r="40" fill="#f0f0f0" fillOpacity="0.4"/>
      <circle cx="100" cy="0" r="40" fill="#f0f0f0" fillOpacity="0.4"/>
      <circle cx="0" cy="100" r="40" fill="#f0f0f0" fillOpacity="0.4"/>
      <circle cx="100" cy="100" r="40" fill="#f0f0f0" fillOpacity="0.4"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#circles)"/>
</svg>
`

// Enhanced BackgroundWrapper with gradient overlay
const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen p-6 relative bg-gradient-to-br from-blue-50 to-purple-50">
    <div
      className="absolute inset-0"
      style={{
        background: `url("data:image/svg+xml,${encodeURIComponent(backgroundSvg)}") repeat`,
        backgroundSize: '200px 200px',
        opacity: 0.3,
      }}
    />
    <div className="relative max-w-6xl mx-auto">
      {children}
    </div>
  </div>
)

// Enhanced types with icons
type Allocation = {
  amount: number
  color: string
  label: string
  description: string
  icon: React.ReactNode
}

type Allocations = {
  [key in 'needs' | 'wants' | 'savings' | 'investments' | 'credit_emi']: Allocation
}

export default function SalaryPlanner() {
  const [salary, setSalary] = useState<string>('')
  const [allocations, setAllocations] = useState<Allocations | null>(null)
  const [error, setError] = useState<string>('')

  const validateSalary = (value: string): boolean => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid salary amount greater than 0')
      return false
    }
    if (numValue > 10000000) {
      setError('Amount seems unusually high. Please verify.')
      return false
    }
    setError('')
    return true
  }

  const calculateAllocations = (amount: number): Allocations => {
    return {
      needs: {
        amount: amount * 0.4,
        color: '#FF6384',
        label: 'Needs',
        description: 'Essential expenses like rent, utilities, and groceries',
        icon: <Home className="w-4 h-4" />
      },
      wants: {
        amount: amount * 0.2,
        color: '#36A2EB',
        label: 'Wants',
        description: 'Non-essential items and entertainment',
        icon: <ShoppingBag className="w-4 h-4" />
      },
      savings: {
        amount: amount * 0.2,
        color: '#FFCE56',
        label: 'Savings',
        description: 'Emergency fund and future goals',
        icon: <PiggyBank className="w-4 h-4" />
      },
      investments: {
        amount: amount * 0.1,
        color: '#4BC0C0',
        label: 'Investments',
        description: 'Long-term wealth building',
        icon: <TrendingUp className="w-4 h-4" />
      },
      credit_emi: {
        amount: amount * 0.1,
        color: '#9966FF',
        label: 'Credit/EMI',
        description: 'Loan payments and credit cards',
        icon: <CreditCard className="w-4 h-4" />
      }
    }
  }

  const analyzeSalary = () => {
    if (!validateSalary(salary)) return
    const alloc = calculateAllocations(Number(salary))
    setAllocations(alloc)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getChartData = () => {
    if (!allocations) return []
    return Object.entries(allocations).map(([key, allocation]) => ({
      name: allocation.label,
      value: allocation.amount,
      color: allocation.color
    }))
  }

  return (
    <BackgroundWrapper>
      <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/90 shadow-xl">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Wallet className="w-8 h-8 text-blue-600" />
            Smart Salary Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Enter your monthly salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="text-lg focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                onClick={analyzeSalary}
                size="lg"
                className="w-32 bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Analyze
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-fadeIn">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {allocations && (
              <div className="grid md:grid-cols-2 gap-8 mt-4 animate-fadeIn">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Monthly Allocations</h3>
                  <div className="space-y-4">
                    {Object.entries(allocations).map(([key, allocation]) => (
                      <div key={key} className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${allocation.color}20` }}>
                              {allocation.icon}
                            </div>
                            <span className="font-medium">{allocation.label}</span>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(allocation.amount)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 pl-11">
                          {allocation.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          value,
                          name
                        }) => {
                          const RADIAN = Math.PI / 180
                          const radius = 25 + innerRadius + (outerRadius - innerRadius)
                          const x = cx + radius * Math.cos(-midAngle * RADIAN)
                          const y = cy + radius * Math.sin(-midAngle * RADIAN)
                          const percent = ((value / Number(salary)) * 100).toFixed(0)

                          return (
                            <text
                              x={x}
                              y={y}
                              className="text-xs"
                              textAnchor={x > cx ? 'start' : 'end'}
                              dominantBaseline="central"
                            >
                              {`${name} (${percent}%)`}
                            </text>
                          )
                        }}
                      >
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </BackgroundWrapper>
  )
}

