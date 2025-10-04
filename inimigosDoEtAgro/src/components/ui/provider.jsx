'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { ThemeProvider } from 'next-themes'
import React from 'react'


export function Provider({children}) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute = 'class' disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
