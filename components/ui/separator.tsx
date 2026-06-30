<<<<<<< HEAD
"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
=======
version https://git-lfs.github.com/spec/v1
oid sha256:75085bd84ff6965e4a356c53a4689799cabf65caa93c0bba064d5a0c6fa78f13
size 545
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
