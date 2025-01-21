'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, ThumbsUp } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function FeedbackChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState({
    name: '',
    mobile: '',
    rating: '',
    review: ''
  })
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSubmit = () => {
    // Here you would typically send the feedback to your server
    console.log('Feedback submitted:', feedback)
    setShowThankYou(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setStep(0)
    setFeedback({ name: '', mobile: '', rating: '', review: '' })
    setShowThankYou(false)
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Input
              placeholder="Your Name"
              value={feedback.name}
              onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
              className="mb-4"
            />
            <Input
              placeholder="Mobile Number"
              value={feedback.mobile}
              onChange={(e) => setFeedback({ ...feedback, mobile: e.target.value })}
            />
          </>
        )
      case 1:
        return (
          <RadioGroup
            value={feedback.rating}
            onValueChange={(value) => setFeedback({ ...feedback, rating: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">3</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="r5" />
              <Label htmlFor="r5">5</Label>
            </div>
          </RadioGroup>
        )
      case 2:
        return (
          <Textarea
            placeholder="Your review"
            value={feedback.review}
            onChange={(e) => setFeedback({ ...feedback, review: e.target.value })}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (step < 2) setStep(step + 1)
                else handleSubmit()
              }}
            >
              {step < 2 ? 'Next' : 'Submit'}
            </Button>
          </CardFooter>
        </Card>
      )}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="w-6 h-6 text-green-500" />
              Thank You!
            </DialogTitle>
            <DialogDescription>
              We appreciate your feedback. It helps us improve our service.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleClose}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

