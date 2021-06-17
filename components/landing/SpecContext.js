import { createContext, useContext } from 'react';

export const SpecContext = createContext(null);

export const SpecProvider = SpecContext.Provider;

export function useSpecContext() {
  const context = useContext(SpecContext);
  if (!context) {
    throw new Error('useSpecContext must be used within a SpecContextProvider');
  }
  return context;
}
