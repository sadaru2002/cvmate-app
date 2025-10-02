import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        'gradient-glow': 'gradient-glow-button', // Apply the new custom class
        'gradient-glow-destructive': 'gradient-glow-destructive-button', // New variant for destructive gradient glow
        'theme-selector': 'bg-purple-200 text-purple-800 hover:bg-purple-300', // New variant for theme selection
        'glass-outline': 'bg-black/20 border-white/20 text-white hover:bg-black/30', // New variant for glassmorphism outline
        'glass-tab': 'bg-black/20 border border-white/20 text-white hover:bg-white/10', // New variant for glassmorphism tabs
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        // Custom sizes for gradient-glow variant to apply min-width to the outer button
        'gradient-glow-default': 'min-w-[140px]',
        'gradient-glow-sm': 'min-w-[120px]',
        'gradient-glow-lg': 'min-w-[160px]',
        'gradient-glow-icon': 'size-9 min-w-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  let innerSpanClasses = '';
  let buttonSizeClass = size; // Default to the passed size

  if (variant === 'gradient-glow' || variant === 'gradient-glow-destructive') {
    // The outer button will get the `gradient-glow-button` or `gradient-glow-destructive-button` class.
    // The `size` prop will be used to determine the inner span's padding and text size.
    switch (size) {
      case 'sm':
        innerSpanClasses = 'px-3 py-1.5 text-sm';
        buttonSizeClass = 'gradient-glow-sm'; // Use custom size variant for min-width
        break;
      case 'lg':
        innerSpanClasses = 'px-6 py-2.5 text-lg';
        buttonSizeClass = 'gradient-glow-lg'; // Use custom size variant for min-width
        break;
      case 'icon':
        innerSpanClasses = 'p-2.5'; // size-9 button, 3px outer padding, inner span is effectively size-7.5, p-2.5 makes it fill.
        buttonSizeClass = 'gradient-glow-icon'; // Use custom size variant for min-width
        break;
      default: // 'default' size
        innerSpanClasses = 'px-4 py-2 text-base'; // Changed from text-lg to text-base, and py-2
        buttonSizeClass = 'gradient-glow-default'; // Use custom size variant for min-width
        break;
    }
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size: buttonSizeClass, className }))}
      ref={ref} // Forward the ref here
      {...props}
    >
      {variant === 'gradient-glow' || variant === 'gradient-glow-destructive' ? (
        <span className={cn("inline-flex items-center justify-center h-full w-full", innerSpanClasses)}>
          {children}
        </span>
      ) : (
        children
      )}
    </Comp>
  )
})
Button.displayName = 'Button' // Add display name for better debugging

export { Button, buttonVariants }