import {createContext} from 'react'

export const DocumentContext = createContext<{id: string} | null>(null)
