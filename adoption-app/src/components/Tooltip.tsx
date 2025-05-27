import {
    Tooltip as ChakraTooltip,
    TooltipProps as ChakraTooltipProps,
    Portal,
} from "@chakra-ui/react"
import React from "react"

export interface TooltipProps extends ChakraTooltipProps {
    content: React.ReactNode
    showArrow?: boolean
    portalled?: boolean
    portalRef?: React.RefObject<HTMLElement | null>
    disabled?: boolean
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
    function Tooltip({ content, showArrow = false, portalled = true, portalRef, disabled, children, ...rest }, ref) {
        if (disabled) return <>{children}</>

        const tooltip = (
            <ChakraTooltip
                label={content}
                hasArrow={showArrow}
                {...rest}
            >
                {children}
            </ChakraTooltip>
        )

        return portalled ? (
            <Portal containerRef={portalRef}>{tooltip}</Portal>
        ) : (
            tooltip
        )
    }
)

