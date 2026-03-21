import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { persistenceService, STATS_SOURCE_LABELS, STATS_SOURCE_COLORS, ISSUE_TYPES } from '../services/persistenceService';

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
    text: () => Promise.resolve(message),
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
      expect(body.key2).toBe('pastPaper-maths-2021');
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
      expect(body.key2).toBe('studocu-metals');
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

  describe('ISSUE_TYPES', () => {
    it('should have all expected issue types', () => {
      expect(ISSUE_TYPES).toHaveLength(7);
      expect(ISSUE_TYPES.find(t => t.value === 'wrong_answer')?.label).toBe('Wrong Answer');
      expect(ISSUE_TYPES.find(t => t.value === 'ambiguous')?.label).toBe('Ambiguous Question');
      expect(ISSUE_TYPES.find(t => t.value === 'typo')?.label).toBe('Typo/Grammar Error');
      expect(ISSUE_TYPES.find(t => t.value === 'missing_info')?.label).toBe('Missing Information');
      expect(ISSUE_TYPES.find(t => t.value === 'image_issue')?.label).toBe('Image Not Loading');
      expect(ISSUE_TYPES.find(t => t.value === 'incorrect_image')?.label).toBe('Incorrect Image');
      expect(ISSUE_TYPES.find(t => t.value === 'other')?.label).toBe('Other');
    });
  });

  describe('saveQuestionReport', () => {
    it('should save a question report', async () => {
      mockFetch();
      
      const result = await persistenceService.saveQuestionReport({
        question: { id: 'q1', question: 'What is the tensile strength?' },
        issueType: 'wrong_answer',
        comment: 'The answer is incorrect',
        section: 'civil',
      });

      expect(result.success).toBe(true);
      expect(result.entityId).toBe('q1-naina');

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.entityType).toBe('QUESTION_REPORT');
      expect(body.key1).toBe('AI_GENERATED');
      expect(body.key2).toBe('civil');
      expect(body.key3).toBe('MC');
      expect(body.payload.questionId).toBe('q1');
      expect(body.payload.issueType).toBe('wrong_answer');
      expect(body.payload.comment).toBe('The answer is incorrect');
      expect(body.payload.userId).toBe('naina');
      expect(body.payload.resolved).toBe(false);
    });

    it('should save report without comment', async () => {
      mockFetch();
      
      await persistenceService.saveQuestionReport({
        question: { id: 'q2', question: 'Test question' },
        issueType: 'ambiguous',
        comment: '',
        section: 'transport',
      });

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.payload.comment).toBe('');
    });

    it('should truncate question text to 100 chars', async () => {
      mockFetch();
      const longQuestion = 'A'.repeat(150);
      
      await persistenceService.saveQuestionReport({
        question: { id: 'q3', question: longQuestion },
        issueType: 'typo',
        comment: '',
        section: 'civil',
      });

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.payload.questionText.length).toBe(100);
    });

    it('should return error on failed save', async () => {
      mockFetchError(400, 'Bad Request');
      
      const result = await persistenceService.saveQuestionReport({
        question: { id: 'q1', question: 'Test' },
        issueType: 'wrong_answer',
        comment: '',
        section: 'civil',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad Request');
    });
  });

  describe('getAllReports', () => {
    it('should fetch all question reports', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          items: [
            { pk: 'report-1', payload: { questionId: 'q1', issueType: 'wrong_answer' } },
            { pk: 'report-2', payload: { questionId: 'q2', issueType: 'typo' } },
          ],
        }),
      });

      const result = await persistenceService.getAllReports();

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('entityType=QUESTION_REPORT'),
        expect.any(Object)
      );
    });

    it('should return empty items on error', async () => {
      global.fetch.mockRejectedValue(new Error('Network Error'));

      const result = await persistenceService.getAllReports();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.items).toEqual([]);
    });
  });

  describe('deleteReport', () => {
    it('should delete a report', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await persistenceService.deleteReport('tenant-hsc-papers#QUESTION_REPORT#civil-mc-2-naina');

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/QUESTION_REPORT/civil-mc-2-naina'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should return error on failed delete', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await persistenceService.deleteReport('tenant-hsc-papers#QUESTION_REPORT#report-1');

      expect(result.success).toBe(false);
    });
  });

  describe('resolveReport', () => {
    it('should resolve a report', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const items = [
        { pk: 'tenant-hsc-papers#QUESTION_REPORT#civil-mc-2-naina', key1: 'AI_GENERATED', key2: 'civil', key3: 'MC', payload: { questionId: 'q1', issueType: 'wrong_answer', resolved: false } },
      ];

      const result = await persistenceService.resolveReport('tenant-hsc-papers#QUESTION_REPORT#civil-mc-2-naina', items);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/QUESTION_REPORT/civil-mc-2-naina'),
        expect.objectContaining({ method: 'PUT' })
      );

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.payload.resolved).toBe(true);
    });

    it('should return error if report not found', async () => {
      const items = [
        { pk: 'report-1', payload: { questionId: 'q1' } },
      ];

      const result = await persistenceService.resolveReport('report-999', items);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Report not found');
    });
  });
});
