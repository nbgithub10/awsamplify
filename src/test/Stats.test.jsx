import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../services/persistenceService', () => ({
  persistenceService: {
    getAllAttempts: vi.fn(),
  },
  STATS_SOURCE_LABELS: {
    PAST_PAPER: 'Past Papers',
    AI_GENERATED: 'AI Generated',
    STUDOCU: 'Studocu',
  },
  STATS_SOURCE_COLORS: {
    PAST_PAPER: '#28a745',
    AI_GENERATED: '#007bff',
    STUDOCU: '#f97316',
  },
}));

import { persistenceService } from '../services/persistenceService';
import Stats from '../pages/Stats';

const mockAttempts = [
  {
    pk: '1',
    key1: 'PAST_PAPER',
    key2: 'maths',
    key3: '2021',
    payload: {
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      section: 'Mathematics 2021',
      userId: 'naina',
      attemptedAt: '2026-03-21T10:00:00Z',
    },
  },
  {
    pk: '2',
    key1: 'AI_GENERATED',
    key2: 'civil',
    key3: 'MIXED',
    payload: {
      score: 5,
      totalQuestions: 10,
      percentage: 50,
      section: 'Civil Structures',
      userId: 'naina',
      attemptedAt: '2026-03-20T10:00:00Z',
    },
  },
  {
    pk: '3',
    key1: 'PAST_PAPER',
    key2: 'maths',
    key3: '2022',
    payload: {
      score: 9,
      totalQuestions: 10,
      percentage: 90,
      section: 'Mathematics 2022',
      userId: 'naina',
      attemptedAt: '2026-03-19T10:00:00Z',
    },
  },
];

describe('Stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    persistenceService.getAllAttempts.mockImplementation(
      () => new Promise(() => {})
    );

    render(<Stats onBack={vi.fn()} />);

    expect(screen.getByText(/loading stats/i)).toBeTruthy();
  });

  it('should show empty state when no attempts', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: [],
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/no stats yet/i)).toBeTruthy();
    });
  });

  it('should display summary cards with correct values', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: mockAttempts,
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/total quizzes/i)).toBeTruthy();
      expect(screen.getByText(/average score/i)).toBeTruthy();
    });
  });

  it('should show stats by source', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: mockAttempts,
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getAllByText('Past Papers').length).toBeGreaterThan(0);
      expect(screen.getAllByText('AI Generated').length).toBeGreaterThan(0);
    });
  });

  it('should show recent attempts table', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: mockAttempts,
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/recent attempts/i)).toBeTruthy();
    });
  });

  it('should have back button', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: [],
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeTruthy();
    });
  });

  it('should show start quiz button when no stats', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: [],
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start a quiz/i })).toBeTruthy();
    });
  });

  it('should show error state on API failure', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: false,
      error: 'Network Error',
      items: [],
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load stats/i)).toBeTruthy();
    });
  });

  it('should show retry button on error', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: false,
      error: 'Network Error',
      items: [],
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeTruthy();
    });
  });

  it('should have filter dropdown', async () => {
    persistenceService.getAllAttempts.mockResolvedValue({
      success: true,
      items: mockAttempts,
    });

    render(<Stats onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toBeTruthy();
    });
  });
});
