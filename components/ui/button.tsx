import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]',
  {
    variants: {
      variant: {
        default:
          'bg-[color:var(--primary)] px-4 py-2.5 text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary-strong)]',
        outline:
          'border border-[color:var(--border)] bg-white px-4 py-2.5 text-[color:var(--foreground)] hover:bg-[color:var(--muted)]',
        ghost: 'px-3 py-2 text-[color:var(--foreground)] hover:bg-[color:var(--muted)]',
        secondary:
          'bg-[color:var(--secondary)] px-4 py-2.5 text-[color:var(--secondary-foreground)] hover:opacity-90',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-5 text-base',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
