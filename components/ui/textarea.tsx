import * as React from 'react'

import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-28 w-full rounded-2xl border border-[color:var(--border)] bg-white px-3 py-3 text-sm text-slate-950 outline-none ring-offset-white placeholder:text-slate-400 focus:ring-2 focus:ring-[color:var(--ring)]',
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'
