
import { useUser } from '@/context/UserContext';
import { useVocabulary } from '@/context/VocabularyContext';
import { useSRS } from '@/context/SRSContext';

/**
 * Combined hook that provides access to all app contexts.
 * Use this when you need data from multiple contexts in a single component.
 */
export function useAppContext() {
  const userContext = useUser();
  const vocabularyContext = useVocabulary();
  const srsContext = useSRS();

  return {
    user: userContext,
    vocabulary: vocabularyContext,
    srs: srsContext,
  };
}
