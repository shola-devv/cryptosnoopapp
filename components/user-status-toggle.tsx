"use client"

import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Crown, User } from "lucide-react"

export function UserStatusToggle() {
  const { isPaidUser, setIsPaidUser } = useTheme()

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsPaidUser(!isPaidUser)}>
      {isPaidUser ? (
        <>
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>Premium</span>
        </>
      ) : (
        <>
          <User className="h-4 w-4" />
          <span>Free User</span>
        </>
      )}
    </Button>
  )
}
