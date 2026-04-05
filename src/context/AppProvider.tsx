
import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { VocabularyProvider } from './VocabularyContext';
import { SRSProvider } from './SRSContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <VocabularyProvider>
        <SRSProvider>
          {children}
        </SRSProvider>
      </VocabularyProvider>
    </UserProvider>
  );
}
