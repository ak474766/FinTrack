import { useToast } from "@/components/ui/use-toast"

export const toast = {
  success: (message: string) => {
    const { toast } = useToast()
    toast({
      title: "Success",
      description: message,
    })
  },
  error: (message: string) => {
    const { toast } = useToast()
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })
  },
}

