'use client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { useColorMode, LightMode, DarkMode } from './color-mode'

function RootTheming({ children }) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <DarkMode>{children}</DarkMode> : <LightMode>{children}</LightMode>
}

export function Provider({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <RootTheming>{children}</RootTheming>
      </ThemeProvider>
    </ChakraProvider>
  )
}
