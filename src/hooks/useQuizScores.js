import { useState, useEffect, useCallback } from 'react';
import { persistenceService } from '../services/persistenceService';
import { studocuQuizData } from '../data/studocu/index';
import { pastPapersRegistry } from '../data/past_papers/index';

const CACHE_KEY = 'quizScores';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getAllSectionIds = () => {
  const sectionIds = [];

  // AI Generated sections
  sectionIds.push('civil', 'transport', 'all');

  // Studocu sections
  Object.keys(studocuQuizData.sections).forEach((topicId) => {
    sectionIds.push(`studocu-${topicId}`);
  });

  // Past Papers sections
  Object.entries(pastPapersRegistry).forEach(([subjectSlug, subjectData]) => {
    Object.keys(subjectData.papers || {}).forEach((paperSlug) => {
      sectionIds.push(`pastPaper-${subjectSlug}-${paperSlug}`);
    });
  });

  return sectionIds;
};

const getMostRecentBySection = (attempts) => {
  const recentBySection = {};

  attempts.forEach((item) => {
    const sectionId = item.key2;
    const attemptedAt = item.payload?.attemptedAt;

    if (!sectionId) return;

    if (!recentBySection[sectionId] || new Date(attemptedAt) > new Date(recentBySection[sectionId].attemptedAt)) {
      recentBySection[sectionId] = {
        score: item.payload?.score ?? 0,
        totalQuestions: item.payload?.totalQuestions ?? 0,
        percentage: item.payload?.percentage ?? 0,
        attemptedAt,
        key1: item.key1,
        section: item.payload?.section || sectionId,
      };
    }
  });

  return recentBySection;
};

const calculateStats = (recentBySection) => {
  const allSections = getAllSectionIds();
  const attemptedSections = Object.keys(recentBySection);
  const notAttempted = allSections.filter((id) => !attemptedSections.includes(id));
  const averageScore =
    attemptedSections.length > 0
      ? Math.round(
          attemptedSections.reduce((sum, id) => sum + (recentBySection[id]?.percentage || 0), 0) /
            attemptedSections.length
        )
      : 0;

  return {
    total: allSections.length,
    attempted: attemptedSections.length,
    notAttempted: notAttempted.length,
    averageScore,
  };
};

const loadFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { lastFetched, attempts, recentBySection, stats } = JSON.parse(cached);
    const cacheAge = Date.now() - new Date(lastFetched).getTime();

    if (cacheAge < CACHE_TTL_MS) {
      return { attempts, recentBySection, stats, lastFetched };
    }
    return null;
  } catch {
    return null;
  }
};

const saveToCache = (attempts, recentBySection, stats) => {
  try {
    const data = {
      lastFetched: new Date().toISOString(),
      attempts,
      recentBySection,
      stats,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save scores to localStorage:', error);
  }
};

export const clearScoresCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear scores cache:', error);
  }
};

export const useQuizScores = () => {
  const [recentBySection, setRecentBySection] = useState({});
  const [stats, setStats] = useState({ total: 0, attempted: 0, notAttempted: 0, averageScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    if (!forceRefresh) {
      const cached = loadFromCache();
      if (cached) {
        setRecentBySection(cached.recentBySection);
        setStats(cached.stats);
        setLastFetched(cached.lastFetched);
        setIsLoading(false);
        return;
      }
    }

    clearScoresCache();
    const result = await persistenceService.getAllAttempts();

    if (result.success) {
      const recent = getMostRecentBySection(result.items);
      const calculatedStats = calculateStats(recent);

      setRecentBySection(recent);
      setStats(calculatedStats);
      setLastFetched(new Date().toISOString());

      saveToCache(result.items, recent, calculatedStats);
    } else {
      setError(result.error);
      if (!forceRefresh) {
        const cached = loadFromCache();
        if (cached) {
          setRecentBySection(cached.recentBySection);
          setStats(cached.stats);
          setLastFetched(cached.lastFetched);
        }
      }
    }

    setIsLoading(false);
  }, []);

  const refreshScores = useCallback(() => {
    return fetchScores(true);
  }, [fetchScores]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return {
    recentBySection,
    stats,
    isLoading,
    refreshScores,
    lastFetched,
    error,
    getScoreForSection: (sectionId) => recentBySection[sectionId] || null,
  };
};

export { getAllSectionIds, getMostRecentBySection, calculateStats };
