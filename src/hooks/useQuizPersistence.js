import { useState, useCallback } from 'react';
import { persistenceService } from '../services/persistenceService';

export const useQuizPersistence = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveResult, setLastSaveResult] = useState(null);

  const saveQuizAttempt = useCallback(async ({ section, questions, score, totalQuestions, totalMCQuestions }) => {
    setIsSaving(true);
    setLastSaveResult(null);

    try {
      const result = await persistenceService.saveQuizAttempt({
        section,
        questions,
        score,
        totalQuestions,
        totalMCQuestions,
      });

      setLastSaveResult(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveQuizAttempt,
    isSaving,
    lastSaveResult,
  };
};
