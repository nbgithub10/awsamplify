import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { persistenceService, STATS_SOURCE_LABELS, STATS_SOURCE_COLORS } from '../services/persistenceService';

global.fetch = vi.fn();

const mockFetch = () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ pk: 'test-pk-123' }),
  });
};

const mockFetchError = (status = 500, message = 'Server Error') => {
  global.fetch.mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  });
};

describe('persistenceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch.mockReset();
  });

  describe('saveQuizAttempt', () => {
    it('should save a quiz attempt for past paper section', async () => {
      mockFetch();
      
      const result = await persistenceService.saveQuizAttempt({
        section: 'pastPaper-maths-2021',
        questions: [{ id: 'q1' }, { id: 'q2' }],
        score: 8,
        totalQuestions: 10,
        totalMCQuestions: 10,
      });

      expect(result.success).toBe(true);
      expect(result.entityId).toBeDefined();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-tenant-id': 'tenant-hsc-papers',
          }),
        })
      );

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.entityType).toBe('QUIZ_ATTEMPT');
      expect(body.key1).toBe('PAST_PAPER');
      expect(body.key2).toBe('maths');
      expect(body.key3).toBe('2021');
      expect(body.payload.score).toBe(8);
      expect(body.payload.totalQuestions).toBe(10);
      expect(body.payload.percentage).toBe(80);
      expect(body.payload.userId).toBe('naina');
    });

    it('should save a quiz attempt for AI generated section', async () => {
      mockFetch();
      
      const result = await persistenceService.saveQuizAttempt({
        section: 'civil',
        questions: [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }, { id: 'q4' }, { id: 'q5' }],
        score: 3,
        totalQuestions: 5,
        totalMCQuestions: 5,
      });

      expect(result.success).toBe(true);

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.key1).toBe('AI_GENERATED');
      expect(body.key2).toBe('civil');
    });

    it('should save a quiz attempt for studocu section', async () => {
      mockFetch();
      
      const result = await persistenceService.saveQuizAttempt({
        section: 'studocu-metals',
        questions: [{ id: 'q1' }, { id: 'q2' }],
        score: 2,
        totalQuestions: 2,
        totalMCQuestions: 2,
      });

      expect(result.success).toBe(true);

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.key1).toBe('STUDOCU');
      expect(body.key2).toBe('metals');
    });

    it('should return error on failed save', async () => {
      mockFetchError(400, 'Bad Request');

      const result = await persistenceService.saveQuizAttempt({
        section: 'civil',
        questions: [],
        score: 0,
        totalQuestions: 0,
        totalMCQuestions: 0,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad Request');
    });

    it('should calculate percentage correctly', async () => {
      mockFetch();
      
      await persistenceService.saveQuizAttempt({
        section: 'civil',
        questions: Array(20).fill({}),
        score: 15,
        totalQuestions: 20,
        totalMCQuestions: 20,
      });

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.payload.percentage).toBe(75);
    });

    it('should round percentage to nearest integer', async () => {
      mockFetch();
      
      await persistenceService.saveQuizAttempt({
        section: 'civil',
        questions: Array(3).fill({}),
        score: 2,
        totalQuestions: 3,
        totalMCQuestions: 3,
      });

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.payload.percentage).toBe(67);
    });
  });

  describe('getAllAttempts', () => {
    it('should fetch all quiz attempts', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          items: [
            { pk: '1', payload: { score: 8, percentage: 80 } },
            { pk: '2', payload: { score: 5, percentage: 50 } },
          ],
        }),
      });

      const result = await persistenceService.getAllAttempts();

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('entityType=QUIZ_ATTEMPT'),
        expect.any(Object)
      );
    });

    it('should return empty items on error', async () => {
      global.fetch.mockRejectedValue(new Error('Network Error'));

      const result = await persistenceService.getAllAttempts();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.items).toEqual([]);
    });
  });

  describe('getAttemptsBySource', () => {
    it('should filter attempts by source', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      await persistenceService.getAttemptsBySource('PAST_PAPER');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('key1=PAST_PAPER'),
        expect.any(Object)
      );
    });
  });

  describe('getAttemptsByCategory', () => {
    it('should filter attempts by category', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      await persistenceService.getAttemptsByCategory('maths');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('key2=maths'),
        expect.any(Object)
      );
    });
  });

  describe('getAttemptsBySourceAndCategory', () => {
    it('should filter by both source and category', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      await persistenceService.getAttemptsBySourceAndCategory('PAST_PAPER', 'maths');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('key1=PAST_PAPER'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('key2=maths'),
        expect.any(Object)
      );
    });
  });

  describe('STATS_SOURCE_LABELS', () => {
    it('should have labels for all sources', () => {
      expect(STATS_SOURCE_LABELS.PAST_PAPER).toBe('Past Papers');
      expect(STATS_SOURCE_LABELS.AI_GENERATED).toBe('AI Generated');
      expect(STATS_SOURCE_LABELS.STUDOCU).toBe('Studocu');
    });
  });

  describe('STATS_SOURCE_COLORS', () => {
    it('should have colors for all sources', () => {
      expect(STATS_SOURCE_COLORS.PAST_PAPER).toBe('#28a745');
      expect(STATS_SOURCE_COLORS.AI_GENERATED).toBe('#007bff');
      expect(STATS_SOURCE_COLORS.STUDOCU).toBe('#f97316');
    });
  });
});
