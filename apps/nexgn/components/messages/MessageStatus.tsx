import { Check, Clock3 } from "lucide-react"

export default function MessageStatus({ status, className }: { status?: "Sent" | "Delivered" | "Seen" | "Pending", className?: string }) {
    if (!status) return null
  
    switch (status) {
      case 'Pending':
        return <Clock3 className={`h-4 w-4 text-gray-400 mr-1 ${className}`} />
      case 'Sent':
        return <Check className={`h-4 w-4 text-gray-400 mr-1 ${className}`} />
      case 'Delivered':
        return (
          <span className="relative mr-1">
            <Check className={`h-4 w-4 text-gray-400 ${className}`} />
            <Check className={`h-4 w-4 text-gray-400 absolute -left-1 top-0 ${className}`} />
          </span>
        )
      case 'Seen':
        return (
          <span className="relative mr-1">
            <Check className={`h-4 w-4 text-blue-500 ${className}`} />
            <Check className={`h-4 w-4 text-blue-500 absolute -left-1 top-0 ${className}`} />
          </span>
        )
    }
  }