import * as React from "react"
import {
  Alert as ChakraAlert,
  type AlertRootProps,
} from "@chakra-ui/react"

export interface AlertProps extends Omit<AlertRootProps, "title"> {
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  title?: React.ReactNode
  icon?: React.ReactElement
}

export const AlertClosedComponent = React.forwardRef<HTMLDivElement, AlertProps>(
  (props, ref) => {
    const { title, children, icon, startElement, endElement, ...rest } = props

    return (
      
      <ChakraAlert.Root ref={ref} {...rest}>
        {startElement ?? <ChakraAlert.Indicator>{icon}</ChakraAlert.Indicator>}

        {children ? (
          <ChakraAlert.Content>
            <ChakraAlert.Title>{title}</ChakraAlert.Title>
            <ChakraAlert.Description>{children}</ChakraAlert.Description>
          </ChakraAlert.Content>
        ) : (
          <ChakraAlert.Title flex="1">{title}</ChakraAlert.Title>
        )}

        {endElement}
      </ChakraAlert.Root>
    )
  }
)

AlertClosedComponent.displayName = "AlertClosedComponent"
