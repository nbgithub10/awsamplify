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

  const saveQuestionReport = useCallback(async ({ question, issueType, comment, section }) => {
    setIsSaving(true);
    setLastSaveResult(null);

    try {
      const result = await persistenceService.saveQuestionReport({
        question,
        issueType,
        comment,
        section,
      });

      setLastSaveResult(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteReport = useCallback(async (entityId) => {
    setIsSaving(true);
    setLastSaveResult(null);

    try {
      const result = await persistenceService.deleteReport(entityId);
      setLastSaveResult(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resolveReport = useCallback(async (entityId, items) => {
    setIsSaving(true);
    setLastSaveResult(null);

    try {
      const result = await persistenceService.resolveReport(entityId, items);
      setLastSaveResult(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveQuizAttempt,
    saveQuestionReport,
    deleteReport,
    resolveReport,
    isSaving,
    lastSaveResult,
  };
};
