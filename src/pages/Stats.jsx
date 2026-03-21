import React, { useState, useEffect, useMemo } from 'react';
import { persistenceService, STATS_SOURCE_LABELS, STATS_SOURCE_COLORS } from '../services/persistenceService';

const Stats = ({ onBack }) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    const result = await persistenceService.getAllAttempts();
    setLoading(false);
    
    if (result.success) {
      setAttempts(result.items);
    } else {
      setError(result.error);
    }
  };

  const stats = useMemo(() => {
    if (attempts.length === 0) {
      return {
        totalQuizzes: 0,
        totalScore: 0,
        totalQuestions: 0,
        averagePercentage: 0,
        bestScore: 0,
        worstScore: 100,
        bySource: {},
        recentAttempts: [],
      };
    }

    let totalScore = 0;
    let totalQuestions = 0;
    let bestScore = 0;
    let worstScore = 100;
    const bySource = {};
    const byCategory = {};

    attempts.forEach((item) => {
      const payload = item.payload || {};
      const score = payload.score || 0;
      const total = payload.totalQuestions || 0;
      const percentage = payload.percentage || 0;

      totalScore += score;
      totalQuestions += total;
      bestScore = Math.max(bestScore, percentage);
      worstScore = Math.min(worstScore, percentage);

      const source = item.key1 || 'UNKNOWN';
      if (!bySource[source]) {
        bySource[source] = { count: 0, totalScore: 0, totalQuestions: 0, totalPercentage: 0 };
      }
      bySource[source].count++;
      bySource[source].totalScore += score;
      bySource[source].totalQuestions += total;
      bySource[source].totalPercentage += percentage;

      const category = item.key2 || 'UNKNOWN';
      if (!byCategory[category]) {
        byCategory[category] = { count: 0, totalPercentage: 0 };
      }
      byCategory[category].count++;
      byCategory[category].totalPercentage += percentage;
    });

    const sourceStats = Object.entries(bySource).map(([source, data]) => ({
      source,
      label: STATS_SOURCE_LABELS[source] || source,
      color: STATS_SOURCE_COLORS[source] || '#666',
      count: data.count,
      averagePercentage: Math.round(data.totalPercentage / data.count),
      totalScore: data.totalScore,
      totalQuestions: data.totalQuestions,
    }));

    const categoryStats = Object.entries(byCategory).map(([category, data]) => ({
      category,
      count: data.count,
      averagePercentage: Math.round(data.totalPercentage / data.count),
    }));

    return {
      totalQuizzes: attempts.length,
      totalScore,
      totalQuestions,
      averagePercentage: totalQuestions > 0 ? Math.round(totalScore / totalQuestions * 100) : 0,
      bestScore,
      worstScore: worstScore === 100 ? 0 : worstScore,
      bySource: sourceStats,
      byCategory: categoryStats,
      recentAttempts: [...attempts]
        .sort((a, b) => new Date(b.payload?.attemptedAt) - new Date(a.payload?.attemptedAt))
        .slice(0, 10),
    };
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    let filtered = [...attempts];
    
    if (filter !== 'all') {
      filtered = filtered.filter((item) => item.key1 === filter);
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.payload?.attemptedAt) - new Date(a.payload?.attemptedAt));
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => (b.payload?.percentage || 0) - (a.payload?.percentage || 0));
    } else if (sortBy === 'source') {
      filtered.sort((a, b) => (a.key1 || '').localeCompare(b.key1 || ''));
    }

    return filtered;
  }, [attempts, filter, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Failed to load stats: {error}</p>
          <button style={styles.retryButton} onClick={loadStats}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <h1 style={styles.title}>Your Quiz Stats</h1>
      </div>

      {attempts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h2 style={styles.emptyTitle}>No Stats Yet</h2>
          <p style={styles.emptyText}>
            Complete some quizzes and your stats will appear here!
          </p>
          <button style={styles.startButton} onClick={onBack}>
            Start a Quiz
          </button>
        </div>
      ) : (
        <>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryValue}>{stats.totalQuizzes}</div>
              <div style={styles.summaryLabel}>Total Quizzes</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{ ...styles.summaryValue, color: getScoreColor(stats.averagePercentage) }}>
                {stats.averagePercentage}%
              </div>
              <div style={styles.summaryLabel}>Average Score</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryValue}>{stats.totalQuestions}</div>
              <div style={styles.summaryLabel}>Questions Answered</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{ ...styles.summaryValue, color: getScoreColor(stats.bestScore) }}>
                {stats.bestScore}%
              </div>
              <div style={styles.summaryLabel}>Best Score</div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Performance by Source</h2>
            <div style={styles.sourceGrid}>
              {stats.bySource.map((source) => (
                <div
                  key={source.source}
                  style={{ ...styles.sourceCard, borderLeftColor: source.color }}
                >
                  <div style={styles.sourceHeader}>
                    <span style={{ ...styles.sourceLabel, color: source.color }}>
                      {source.label}
                    </span>
                    <span style={styles.sourceCount}>{source.count} quizzes</span>
                  </div>
                  <div style={styles.sourceStats}>
                    <div style={styles.sourceStat}>
                      <span style={styles.sourceStatValue}>{source.averagePercentage}%</span>
                      <span style={styles.sourceStatLabel}>Average</span>
                    </div>
                    <div style={styles.sourceStat}>
                      <span style={styles.sourceStatValue}>{source.totalQuestions}</span>
                      <span style={styles.sourceStatLabel}>Questions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Recent Attempts</h2>
              <div style={styles.filters}>
                <select
                  style={styles.select}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Sources</option>
                  {stats.bySource.map((s) => (
                    <option key={s.source} value={s.source}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  style={styles.select}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="score">Highest Score</option>
                  <option value="source">By Source</option>
                </select>
              </div>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Source</th>
                    <th style={styles.tableHeader}>Section</th>
                    <th style={styles.tableHeader}>Score</th>
                    <th style={styles.tableHeader}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.slice(0, 20).map((item) => {
                    const payload = item.payload || {};
                    return (
                      <tr key={item.pk} style={styles.tableRow}>
                        <td style={styles.tableCell}>{formatDate(payload.attemptedAt)}</td>
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.sourceBadge,
                              backgroundColor: STATS_SOURCE_COLORS[item.key1] || '#666',
                            }}
                          >
                            {STATS_SOURCE_LABELS[item.key1] || item.key1}
                          </span>
                        </td>
                        <td style={styles.tableCell}>{payload.section || item.key2 || 'N/A'}</td>
                        <td style={styles.tableCell}>
                          {payload.score}/{payload.totalQuestions}
                        </td>
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.percentageBadge,
                              backgroundColor: getScoreColor(payload.percentage) + '20',
                              color: getScoreColor(payload.percentage),
                            }}
                          >
                            {payload.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredAttempts.length > 20 && (
                <p style={styles.tableNote}>Showing 20 of {filteredAttempts.length} attempts</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: 0,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1rem',
    color: '#666',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '2rem',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  retryButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1.5rem',
  },
  startButton: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  section: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#333',
    margin: '0 0 1rem 0',
  },
  sourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  sourceCard: {
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid',
    backgroundColor: '#f8f9fa',
  },
  sourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  sourceLabel: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  sourceCount: {
    fontSize: '0.85rem',
    color: '#666',
  },
  sourceStats: {
    display: 'flex',
    gap: '1.5rem',
  },
  sourceStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  sourceStatValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
  },
  sourceStatLabel: {
    fontSize: '0.8rem',
    color: '#666',
  },
  filters: {
    display: 'flex',
    gap: '0.5rem',
  },
  select: {
    padding: '0.5rem',
    fontSize: '0.9rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f8f9fa',
  },
  tableHeader: {
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #ddd',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  tableCell: {
    padding: '0.75rem',
    color: '#333',
  },
  sourceBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  percentageBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  tableNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
};

export default Stats;
