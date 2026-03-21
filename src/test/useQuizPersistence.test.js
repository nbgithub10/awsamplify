import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuizPersistence } from '../hooks/useQuizPersistence';

vi.mock('../services/persistenceService', () => ({
  persistenceService: {
    saveQuizAttempt: vi.fn(),
  },
}));

import { persistenceService } from '../services/persistenceService';

describe('useQuizPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuizPersistence());

    expect(result.current.isSaving).toBe(false);
    expect(result.current.lastSaveResult).toBe(null);
  });

  it('should call saveQuizAttempt with correct parameters', async () => {
    const mockResult = { success: true, entityId: 'test-123' };
    persistenceService.saveQuizAttempt.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useQuizPersistence());

    const params = {
      section: 'civil',
      questions: [],
      score: 5,
      totalQuestions: 10,
      totalMCQuestions: 10,
    };

    await act(async () => {
      const returnValue = await result.current.saveQuizAttempt(params);
      expect(returnValue).toEqual(mockResult);
    });

    expect(persistenceService.saveQuizAttempt).toHaveBeenCalledWith(params);
  });

  it('should set isSaving to true while saving', async () => {
    let resolve;
    const promise = new Promise((r) => { resolve = r; });
    persistenceService.saveQuizAttempt.mockImplementation(() => promise);

    const { result } = renderHook(() => useQuizPersistence());

    act(() => {
      result.current.saveQuizAttempt({
        section: 'civil',
        questions: [],
        score: 5,
        totalQuestions: 10,
        totalMCQuestions: 10,
      });
    });

    expect(result.current.isSaving).toBe(true);

    await act(async () => {
      resolve({ success: true });
    });

    expect(result.current.isSaving).toBe(false);
  });

  it('should set lastSaveResult on successful save', async () => {
    const mockResult = { success: true, entityId: 'test-123' };
    persistenceService.saveQuizAttempt.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useQuizPersistence());

    await act(async () => {
      await result.current.saveQuizAttempt({
        section: 'civil',
        questions: [],
        score: 5,
        totalQuestions: 10,
        totalMCQuestions: 10,
      });
    });

    await waitFor(() => {
      expect(result.current.lastSaveResult).toEqual(mockResult);
    });
  });

  it('should set lastSaveResult on failed save', async () => {
    const mockResult = { success: false, error: 'Network Error' };
    persistenceService.saveQuizAttempt.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useQuizPersistence());

    await act(async () => {
      await result.current.saveQuizAttempt({
        section: 'civil',
        questions: [],
        score: 5,
        totalQuestions: 10,
        totalMCQuestions: 10,
      });
    });

    await waitFor(() => {
      expect(result.current.lastSaveResult).toEqual(mockResult);
    });
  });

  it('should always set isSaving to false even on error', async () => {
    const mockResult = { success: false, error: 'Network Error' };
    persistenceService.saveQuizAttempt.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useQuizPersistence());

    await act(async () => {
      await result.current.saveQuizAttempt({
        section: 'civil',
        questions: [],
        score: 5,
        totalQuestions: 10,
        totalMCQuestions: 10,
      });
    });

    expect(result.current.isSaving).toBe(false);
  });
});
