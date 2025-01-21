'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, PiggyBank, Target, TrendingUp, AlertTriangle } from 'lucide-react'

interface Goal {
  id: string
  amount: number
  purpose: string
  deadline: string
  priority: string
  category: string
  currentAmount: number
  progress: number
  startDate: string
  notes: string
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({})
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate total progress and statistics
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.amount, 0)
  const overallProgress = totalTarget ? (totalSaved / totalTarget) * 100 : 0

  const categories = [
    "Savings", "Investment", "Education", "Travel", "Home", "Emergency Fund", "Other"
  ]

  useEffect(() => {
    // Check for goals near deadline
    const checkDeadlines = () => {
      const today = new Date()
      goals.forEach(goal => {
        const deadline = new Date(goal.deadline)
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysLeft <= 7 && goal.progress < 90) {
          showNotification(`Alert: "${goal.purpose}" is due in ${daysLeft} days and is only ${goal.progress.toFixed(1)}% complete!`)
        }
      })
    }

    checkDeadlines()
  }, [goals])

  const showNotification = (message: string) => {
    // In a real app, you'd implement proper notifications
    console.log(message)
  }

  const addGoal = () => {
    if (newGoal.amount && newGoal.purpose && newGoal.deadline && newGoal.priority && newGoal.category) {
      const goalId = `GOAL_${Date.now()}`
      setGoals([...goals, {
        ...newGoal,
        id: goalId,
        currentAmount: 0,
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        notes: ''
      } as Goal])
      setNewGoal({})
    }
  }

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrentAmount = Math.min(goal.amount, goal.currentAmount + amount)
        const newProgress = (newCurrentAmount / goal.amount) * 100
        
        if (newProgress === 100) {
          showNotification(`Congratulations! You've achieved your goal: ${goal.purpose}`)
        } else if (newProgress >= 50 && goal.progress < 50) {
          showNotification(`You're halfway to your goal: ${goal.purpose}`)
        }
        
        return { ...goal, currentAmount: newCurrentAmount, progress: newProgress }
      }
      return goal
    }))
  }

  const filteredAndSortedGoals = goals
    .filter(goal => {
      if (searchTerm) {
        return goal.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
               goal.category.toLowerCase().includes(searchTerm.toLowerCase())
      }
      if (filter === "all") return true
      if (filter === "urgent") {
        const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysLeft <= 7 && goal.progress < 90
      }
      return goal.priority.toLowerCase() === filter.toLowerCase()
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case "progress":
          return b.progress - a.progress
        case "amount":
          return b.amount - a.amount
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto py-8">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Financial Goal Tracker
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-lg">
                  <PiggyBank className="w-4 h-4 mr-1" />
                  Total Saved: ₹{totalSaved.toLocaleString()}
                </Badge>
                <Badge variant="secondary" className="text-lg">
                  <Target className="w-4 h-4 mr-1" />
                  Progress: {overallProgress.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="goals" className="space-y-4">
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="goals">Active Goals</TabsTrigger>
                <TabsTrigger value="new">Add New Goal</TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Goal Amount"
                    value={newGoal.amount || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, amount: Number(e.target.value) })}
                    className="bg-white"
                  />
                  <Input
                    placeholder="Purpose"
                    value={newGoal.purpose || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, purpose: e.target.value })}
                    className="bg-white"
                  />
                  <Input
                    type="date"
                    placeholder="Deadline"
                    value={newGoal.deadline || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="bg-white"
                  />
                  <Select onValueChange={(value) => setNewGoal({ ...newGoal, priority: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Notes (optional)"
                    value={newGoal.notes || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <Button 
                  onClick={addGoal} 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Add Goal
                </Button>
              </TabsContent>

              <TabsContent value="goals">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Input
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs bg-white"
                  />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Goals</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredAndSortedGoals.map(goal => {
                    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    const isUrgent = daysLeft <= 7 && goal.progress < 90

                    return (
                      <Card key={goal.id} className={`
                        border-l-4 
                        ${goal.progress === 100 ? 'border-l-green-500' : 
                          isUrgent ? 'border-l-red-500' : 
                          goal.priority === 'High' ? 'border-l-yellow-500' : 
                          'border-l-blue-500'}
                      `}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">{goal.purpose}</h3>
                              <div className="flex gap-2 flex-wrap">
                                <Badge variant="outline">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {daysLeft} days left
                                </Badge>
                                <Badge variant="outline">
                                  <PiggyBank className="w-4 h-4 mr-1" />
                                  {goal.category}
                                </Badge>
                                <Badge variant={
                                  goal.priority === 'High' ? 'destructive' :
                                  goal.priority === 'Medium' ? 'secondary' : 'outline'
                                }>
                                  {goal.priority} Priority
                                </Badge>
                              </div>
                            </div>
                            {isUrgent && (
                              <Alert variant="destructive" className="w-fit">
                                <AlertTriangle className="w-4 h-4" />
                                <AlertDescription>Urgent: Goal deadline approaching!</AlertDescription>
                              </Alert>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Progress: {goal.progress.toFixed(1)}%</span>
                              <span>₹{goal.currentAmount.toLocaleString()} / ₹{goal.amount.toLocaleString()}</span>
                            </div>
                            <Progress 
                              value={goal.progress} 
                              className="h-2"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Add contribution"
                                className="bg-white"
                                onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                              />
                              <Button 
                                onClick={() => updateGoalProgress(goal.id, 0)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Update
                              </Button>
                            </div>
                            {goal.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                Notes: {goal.notes}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

