import * as React from 'react'

import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-offset-white placeholder:text-slate-400 focus:ring-2 focus:ring-[color:var(--ring)]',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
