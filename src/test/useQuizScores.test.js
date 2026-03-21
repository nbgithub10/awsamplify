import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuizScores, getMostRecentBySection, calculateStats, getAllSectionIds } from '../hooks/useQuizScores';
import { persistenceService } from '../services/persistenceService';

vi.mock('../services/persistenceService', () => ({
  persistenceService: {
    getAllAttempts: vi.fn(),
  },
}));

vi.mock('../data/studocu/index', () => ({
  studocuQuizData: {
    sections: {
      metals: { title: 'Metals' },
      polymersElastomers: { title: 'Polymers' },
    },
  },
}));

vi.mock('../data/past_papers/index', () => ({
  pastPapersRegistry: {
    maths: {
      title: 'Mathematics',
      papers: {
        '2021': { title: '2021' },
        '2022': { title: '2022' },
      },
    },
  },
}));

describe('useQuizScores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty state', () => {
    persistenceService.getAllAttempts.mockResolvedValue({ success: true, items: [] });

    const { result } = renderHook(() => useQuizScores());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.recentBySection).toEqual({});
    expect(result.current.stats).toEqual({ total: 0, attempted: 0, notAttempted: 0, averageScore: 0 });
  });

  it('should fetch from API when no cache exists', async () => {
    const mockAttempts = [
      {
        key2: 'civil',
        key1: 'AI_GENERATED',
        payload: { score: 8, totalQuestions: 10, percentage: 80, attemptedAt: '2026-03-21T10:00:00Z' },
      },
    ];
    persistenceService.getAllAttempts.mockResolvedValue({ success: true, items: mockAttempts });

    const { result } = renderHook(() => useQuizScores());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(persistenceService.getAllAttempts).toHaveBeenCalled();
    expect(result.current.recentBySection.civil).toBeDefined();
    expect(result.current.recentBySection.civil.percentage).toBe(80);
  });

  it('should use localStorage cache if less than 5 minutes old', async () => {
    const cacheData = {
      lastFetched: new Date().toISOString(),
      attempts: [{ key2: 'civil', payload: { score: 5, totalQuestions: 10, percentage: 50, attemptedAt: '2026-03-21T09:00:00Z' } }],
      recentBySection: { civil: { score: 5, totalQuestions: 10, percentage: 50, attemptedAt: '2026-03-21T09:00:00Z' } },
      stats: { total: 10, attempted: 1, notAttempted: 9, averageScore: 50 },
    };
    localStorage.setItem('quizScores', JSON.stringify(cacheData));

    const { result } = renderHook(() => useQuizScores());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(persistenceService.getAllAttempts).not.toHaveBeenCalled();
    expect(result.current.recentBySection.civil.percentage).toBe(50);
  });

  it('should force refresh when refreshScores is called', async () => {
    const cacheData = {
      lastFetched: new Date().toISOString(),
      attempts: [{ key2: 'civil', payload: { score: 5, percentage: 50, attemptedAt: '2026-03-21T09:00:00Z' } }],
      recentBySection: { civil: { score: 5, percentage: 50, attemptedAt: '2026-03-21T09:00:00Z' } },
      stats: { total: 10, attempted: 1, notAttempted: 9, averageScore: 50 },
    };
    localStorage.setItem('quizScores', JSON.stringify(cacheData));

    const freshAttempts = [
      { key2: 'civil', payload: { score: 9, percentage: 90, attemptedAt: '2026-03-21T12:00:00Z' } },
    ];
    persistenceService.getAllAttempts.mockResolvedValue({ success: true, items: freshAttempts });

    const { result } = renderHook(() => useQuizScores());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recentBySection.civil.percentage).toBe(50);

    await act(async () => {
      await result.current.refreshScores();
    });

    expect(persistenceService.getAllAttempts).toHaveBeenCalled();
    expect(result.current.recentBySection.civil.percentage).toBe(90);
  });

  it('should get score for specific section', async () => {
    const mockAttempts = [
      { key2: 'civil', payload: { score: 8, percentage: 80, attemptedAt: '2026-03-21T10:00:00Z' } },
      { key2: 'transport', payload: { score: 5, percentage: 50, attemptedAt: '2026-03-21T11:00:00Z' } },
    ];
    persistenceService.getAllAttempts.mockResolvedValue({ success: true, items: mockAttempts });

    const { result } = renderHook(() => useQuizScores());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.getScoreForSection('civil')).toBeDefined();
    expect(result.current.getScoreForSection('civil').percentage).toBe(80);
    expect(result.current.getScoreForSection('nonexistent')).toBeNull();
  });
});

describe('getMostRecentBySection', () => {
  it('should keep most recent attempt per section', () => {
    const attempts = [
      { key2: 'civil', payload: { score: 5, percentage: 50, attemptedAt: '2026-03-21T10:00:00Z' } },
      { key2: 'civil', payload: { score: 8, percentage: 80, attemptedAt: '2026-03-21T12:00:00Z' } },
      { key2: 'transport', payload: { score: 7, percentage: 70, attemptedAt: '2026-03-21T11:00:00Z' } },
    ];

    const result = getMostRecentBySection(attempts);

    expect(result.civil.percentage).toBe(80);
    expect(result.transport.percentage).toBe(70);
  });

  it('should handle empty attempts array', () => {
    const result = getMostRecentBySection([]);
    expect(result).toEqual({});
  });
});

describe('calculateStats', () => {
  it('should calculate correct stats', () => {
    const recentBySection = {
      civil: { percentage: 80 },
      transport: { percentage: 70 },
    };

    const result = calculateStats(recentBySection);

    expect(result.total).toBeGreaterThan(0);
    expect(result.attempted).toBe(2);
    expect(result.notAttempted).toBe(result.total - 2);
    expect(result.averageScore).toBe(75);
  });

  it('should return 0 average when no attempts', () => {
    const result = calculateStats({});
    expect(result.averageScore).toBe(0);
    expect(result.attempted).toBe(0);
  });
});

describe('getAllSectionIds', () => {
  it('should return all section IDs from all sources', () => {
    const sectionIds = getAllSectionIds();

    expect(sectionIds).toContain('civil');
    expect(sectionIds).toContain('transport');
    expect(sectionIds).toContain('all');
    expect(sectionIds).toContain('studocu-metals');
    expect(sectionIds).toContain('studocu-polymersElastomers');
    expect(sectionIds).toContain('pastPaper-maths-2021');
    expect(sectionIds).toContain('pastPaper-maths-2022');
  });
});
