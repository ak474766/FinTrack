import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SalaryPlanner from "@/components/SalaryPlanner"
import GoalTracker from "@/components/GoalTracker"
import InvestmentPlanner from "@/components/InvestmentPlanner"
import LoanManager from "@/components/LoanManager"
import SIPCalculator from "@/components/SIPCalculator"
import { Calculator, PiggyBank, Target, TrendingUp, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Fintrack: Your Personal Financial Assistant</h1>
      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="w-full flex flex-wrap justify-between mb-4 gap-2">
          <TabsTrigger value="salary" className="flex-grow flex items-center justify-center gap-2" aria-label="Salary">
            <PiggyBank className="h-4 w-4" />
            <span>Salary</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex-grow flex items-center justify-center gap-2" aria-label="Goals">
            <Target className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex-grow flex items-center justify-center gap-2" aria-label="Investments">
            <TrendingUp className="h-4 w-4" />
            <span>Investments</span>
          </TabsTrigger>
          <TabsTrigger value="sip" className="flex-grow flex items-center justify-center gap-2" aria-label="SIP">
            <Calculator className="h-4 w-4" />
            <span>SIP</span>
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex-grow flex items-center justify-center gap-2" aria-label="Loans">
            <CreditCard className="h-4 w-4" />
            <span>Loans</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="salary">
          <SalaryPlanner />
        </TabsContent>
        <TabsContent value="goals">
          <GoalTracker />
        </TabsContent>
        <TabsContent value="investments">
          <InvestmentPlanner />
        </TabsContent>
        <TabsContent value="sip">
          <SIPCalculator />
        </TabsContent>
        <TabsContent value="loans">
          <LoanManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
