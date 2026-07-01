'use client'

import { LoaderCircle, LogIn, UserPlus } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'

type AuthSubmitIntent = 'login' | 'signup'

interface AuthSubmitButtonProps {
  idleLabel: string
  pendingLabel: string
  intent: AuthSubmitIntent
  className?: string
}

const intentIcons = {
  login: LogIn,
  signup: UserPlus,
} satisfies Record<AuthSubmitIntent, typeof LogIn>

export function AuthSubmitButton({ idleLabel, pendingLabel, intent, className }: AuthSubmitButtonProps) {
  const { pending } = useFormStatus()
  const Icon = intentIcons[intent]

  return (
    <Button className={className} type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : idleLabel}
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
    </Button>
  )
}
