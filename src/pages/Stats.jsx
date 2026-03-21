import React, { useState, useEffect, useMemo } from 'react';
import { persistenceService, STATS_SOURCE_LABELS, STATS_SOURCE_COLORS, ISSUE_TYPES } from '../services/persistenceService';
import { mobileStyles } from '../styles/mobileStyles';

const Stats = ({ onBack }) => {
  const [attempts, setAttempts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [attemptsResult, reportsResult] = await Promise.all([
        persistenceService.getAllAttempts(),
        persistenceService.getAllReports(),
      ]);
      
      if (attemptsResult.success) {
        setAttempts(attemptsResult.items);
      } else {
        setError(attemptsResult.error);
      }
      
      if (reportsResult.success) {
        setReports(reportsResult.items);
      }
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (attempts.length === 0) {
      return {
        totalQuizzes: 0,
        averagePercentage: 0,
        bestScore: 0,
        bySource: [],
        recentAttempts: [],
      };
    }

    const uniqueSectionsMap = attempts.reduce((acc, item) => {
      const sectionId = item.key2;
      if (!sectionId) return acc;
      if (!acc[sectionId] || new Date(item.payload?.attemptedAt) > new Date(acc[sectionId].payload?.attemptedAt)) {
        acc[sectionId] = item;
      }
      return acc;
    }, {});
    const uniqueAttempts = Object.values(uniqueSectionsMap);

    let totalScore = 0;
    let totalQuestions = 0;
    let bestScore = 0;
    const bySource = {};

    uniqueAttempts.forEach((item) => {
      const payload = item.payload || {};
      const score = payload.score || 0;
      const total = payload.totalQuestions || 0;
      const percentage = payload.percentage || 0;

      totalScore += score;
      totalQuestions += total;
      bestScore = Math.max(bestScore, percentage);

      const source = item.key1 || 'UNKNOWN';
      if (!bySource[source]) {
        bySource[source] = { count: 0, totalScore: 0, totalQuestions: 0, totalPercentage: 0 };
      }
      bySource[source].count++;
      bySource[source].totalScore += score;
      bySource[source].totalQuestions += total;
      bySource[source].totalPercentage += percentage;
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

    return {
      totalQuizzes: uniqueAttempts.length,
      totalQuestions,
      averagePercentage: totalQuestions > 0 ? Math.round(totalScore / totalQuestions * 100) : 0,
      bestScore,
      bySource: sourceStats,
      recentAttempts: uniqueAttempts
        .sort((a, b) => new Date(b.payload?.attemptedAt) - new Date(a.payload?.attemptedAt))
        .slice(0, 20),
    };
  }, [attempts]);

  const activeReports = useMemo(() => {
    return reports
      .filter(report => !report.payload?.resolved)
      .sort((a, b) => new Date(b.payload?.reportedAt) - new Date(a.payload?.reportedAt));
  }, [reports]);

  const filteredAttempts = useMemo(() => {
    const uniqueSectionsMap = attempts.reduce((acc, item) => {
      const sectionId = item.key2;
      if (!sectionId) return acc;
      if (!acc[sectionId] || new Date(item.payload?.attemptedAt) > new Date(acc[sectionId].payload?.attemptedAt)) {
        acc[sectionId] = item;
      }
      return acc;
    }, {});
    const uniqueAttempts = Object.values(uniqueSectionsMap);

    let filtered = [...uniqueAttempts];
    
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

  const getIssueTypeLabel = (value) => {
    const type = ISSUE_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const handleResolveReport = async (entityId) => {
    setIsUpdating(true);
    try {
      const result = await persistenceService.resolveReport(entityId, reports);
      if (result.success) {
        setReports(prev => prev.map(r => 
          r.pk === entityId ? { ...r, payload: { ...r.payload, resolved: true } } : r
        ));
      }
    } catch (err) {
      console.error('Failed to resolve report:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReport = async (entityId) => {
    setIsUpdating(true);
    try {
      const result = await persistenceService.deleteReport(entityId);
      if (result.success) {
        setReports(prev => prev.filter(r => r.pk !== entityId));
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasStats = attempts.length > 0;

  return (
    <>
      <style>{mobileStyles}</style>
      <div style={styles.container} className="stats-container">
        <div style={styles.header} className="stats-header">
          <button style={styles.backButton} onClick={onBack} className="stats-back-btn">
            ← Back
          </button>
          <h1 style={styles.title} className="stats-title">Your Quiz Stats</h1>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading stats...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>Failed to load stats: {error}</p>
            <button style={styles.retryButton} onClick={loadStats}>
              Retry
            </button>
          </div>
        ) : !hasStats && activeReports.length === 0 ? (
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
            {hasStats && (
              <>
                <div style={styles.summaryGrid} className="stats-summary-grid">
                  <div style={styles.summaryCard} className="stats-summary-card">
                    <div style={styles.summaryValue} className="stats-summary-value">
                      {stats.totalQuizzes}
                    </div>
                    <div style={styles.summaryLabel} className="stats-summary-label">
                      Total Quizzes
                    </div>
                  </div>
                  <div style={styles.summaryCard} className="stats-summary-card">
                    <div
                      style={{
                        ...styles.summaryValue,
                        color: getScoreColor(stats.averagePercentage),
                      }}
                      className="stats-summary-value"
                    >
                      {stats.averagePercentage}%
                    </div>
                    <div style={styles.summaryLabel} className="stats-summary-label">
                      Average Score
                    </div>
                  </div>
                  <div style={styles.summaryCard} className="stats-summary-card">
                    <div style={styles.summaryValue} className="stats-summary-value">
                      {stats.totalQuestions}
                    </div>
                    <div style={styles.summaryLabel} className="stats-summary-label">
                      Questions Answered
                    </div>
                  </div>
                  <div style={styles.summaryCard} className="stats-summary-card">
                    <div
                      style={{
                        ...styles.summaryValue,
                        color: getScoreColor(stats.bestScore),
                      }}
                      className="stats-summary-value"
                    >
                      {stats.bestScore}%
                    </div>
                    <div style={styles.summaryLabel} className="stats-summary-label">
                      Best Score
                    </div>
                  </div>
                </div>

                {stats.bySource.length > 0 && (
                  <div style={styles.section} className="stats-section">
                    <h2 style={styles.sectionTitle} className="stats-section-title">Performance by Source</h2>
                    <div style={styles.sourceGrid} className="stats-source-grid">
                      {stats.bySource.map((source) => (
                        <div
                          key={source.source}
                          style={{ ...styles.sourceCard, borderLeftColor: source.color }}
                          className="stats-source-card"
                        >
                          <div style={styles.sourceHeader} className="stats-source-header">
                            <span style={{ ...styles.sourceLabel, color: source.color }} className="stats-source-label">
                              {source.label}
                            </span>
                            <span style={styles.sourceCount} className="stats-source-count">{source.count} quizzes</span>
                          </div>
                          <div style={styles.sourceStats} className="stats-source-stats">
                            <div style={styles.sourceStat}>
                              <span style={styles.sourceStatValue} className="stats-source-stat-value">{source.averagePercentage}%</span>
                              <span style={styles.sourceStatLabel} className="stats-source-stat-label">Average</span>
                            </div>
                            <div style={styles.sourceStat}>
                              <span style={styles.sourceStatValue} className="stats-source-stat-value">{source.totalQuestions}</span>
                              <span style={styles.sourceStatLabel} className="stats-source-stat-label">Questions</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {attempts.length > 0 && (
                  <div style={styles.section} className="stats-section">
                    <div style={styles.sectionHeader} className="stats-section-header">
                      <h2 style={styles.sectionTitle} className="stats-section-title">Recent Attempts</h2>
                      <div style={styles.filters} className="stats-filters">
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
                    <div style={styles.tableContainer} className="stats-table-container">
                      <table style={styles.table} className="stats-table">
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
                    </div>
                    <div style={{ ...styles.mobileList, display: 'none' }} className="stats-mobile-list">
                      {filteredAttempts.slice(0, 20).map((item) => {
                        const payload = item.payload || {};
                        return (
                          <div key={item.pk} className="stats-mobile-row">
                            <div className="stats-mobile-card">
                              <div className="stats-mobile-label">Date</div>
                              <div className="stats-mobile-value">{formatDate(payload.attemptedAt)}</div>
                            </div>
                            <div className="stats-mobile-card">
                              <div className="stats-mobile-label">Source</div>
                              <div className="stats-mobile-value">
                                <span
                                  style={{
                                    ...styles.sourceBadge,
                                    backgroundColor: STATS_SOURCE_COLORS[item.key1] || '#666',
                                  }}
                                >
                                  {STATS_SOURCE_LABELS[item.key1] || item.key1}
                                </span>
                              </div>
                            </div>
                            <div className="stats-mobile-card">
                              <div className="stats-mobile-label">Section</div>
                              <div className="stats-mobile-value">{payload.section || item.key2 || 'N/A'}</div>
                            </div>
                            <div className="stats-mobile-card">
                              <div className="stats-mobile-label">Score</div>
                              <div className="stats-mobile-value">{payload.score}/{payload.totalQuestions}</div>
                            </div>
                            <div className="stats-mobile-card" style={{ gridColumn: 'span 2' }}>
                              <div className="stats-mobile-label">%</div>
                              <div className="stats-mobile-value">
                                <span
                                  style={{
                                    ...styles.percentageBadge,
                                    backgroundColor: getScoreColor(payload.percentage) + '20',
                                    color: getScoreColor(payload.percentage),
                                  }}
                                >
                                  {payload.percentage}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {filteredAttempts.length > 20 && (
                      <p style={styles.tableNote}>
                        Showing 20 of {filteredAttempts.length} attempts
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <div style={styles.section} className="stats-section">
              <h2 style={styles.sectionTitle} className="stats-section-title">
                Question Reports ({activeReports.length})
              </h2>
              {activeReports.length === 0 ? (
                <p style={styles.emptyText}>No reported issues yet.</p>
              ) : (
                <>
                  <div style={styles.tableContainer} className="stats-table-container">
                    <table style={styles.table} className="stats-table">
                      <thead>
                        <tr style={styles.tableHeaderRow}>
                          <th style={styles.tableHeader}>Date</th>
                          <th style={styles.tableHeader}>Source</th>
                          <th style={styles.tableHeader}>Question</th>
                          <th style={styles.tableHeader}>Issue Type</th>
                          <th style={styles.tableHeader}>Comment</th>
                          <th style={styles.tableHeader}>User</th>
                          <th style={styles.tableHeader}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeReports.map((report) => {
                          const payload = report.payload || {};
                          const sectionDisplay = payload.section || report.key2 || STATS_SOURCE_LABELS[report.key1] || report.key1;
                          return (
                            <tr key={report.pk} style={styles.tableRow}>
                              <td style={styles.tableCell}>{formatDate(payload.reportedAt)}</td>
                              <td style={styles.tableCell}>
                                <span
                                  style={{
                                    ...styles.sourceBadge,
                                    backgroundColor: STATS_SOURCE_COLORS[report.key1] || '#666',
                                  }}
                                >
                                  {STATS_SOURCE_LABELS[report.key1] || report.key1}
                                </span>
                                <div style={styles.sourceSectionDetail}>
                                  {sectionDisplay}
                                </div>
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.questionCell }}>
                                <span title={payload.questionText}>
                                  {payload.questionText && payload.questionText.length > 50
                                    ? payload.questionText.substring(0, 50) + '...'
                                    : payload.questionText || 'N/A'}
                                </span>
                              </td>
                              <td style={styles.tableCell}>
                                <span
                                  style={{
                                    ...styles.issueTypeBadge,
                                    backgroundColor: '#dc354520',
                                    color: '#dc3545',
                                  }}
                                >
                                  {getIssueTypeLabel(payload.issueType)}
                                </span>
                              </td>
                              <td style={{
                                ...styles.tableCell,
                                fontStyle: payload.comment ? 'normal' : 'italic',
                                color: '#999'
                              }}>
                                {payload.comment || 'No comment'}
                              </td>
                              <td style={styles.tableCell}>{payload.userId || 'Anonymous'}</td>
                              <td style={styles.tableCell}>
                                <div style={styles.actionButtons}>
                                  <button
                                    style={styles.resolveButton}
                                    onClick={() => handleResolveReport(report.pk)}
                                    disabled={isUpdating}
                                    title="Mark as resolved"
                                  >
                                    Resolve
                                  </button>
                                  <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDeleteReport(report.pk)}
                                    disabled={isUpdating}
                                    title="Delete report"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ ...styles.mobileList, display: 'none' }} className="stats-mobile-list">
                    {activeReports.map((report) => {
                      const payload = report.payload || {};
                      const sectionDisplay = payload.section || report.key2 || STATS_SOURCE_LABELS[report.key1] || report.key1;
                      return (
                        <div key={report.pk} className="stats-mobile-row">
                          <div className="stats-mobile-card">
                            <div className="stats-mobile-label">Date</div>
                            <div className="stats-mobile-value">{formatDate(payload.reportedAt)}</div>
                          </div>
                          <div className="stats-mobile-card">
                            <div className="stats-mobile-label">Source</div>
                            <div className="stats-mobile-value">
                              <span
                                style={{
                                  ...styles.sourceBadge,
                                  backgroundColor: STATS_SOURCE_COLORS[report.key1] || '#666',
                                }}
                              >
                                {STATS_SOURCE_LABELS[report.key1] || report.key1}
                              </span>
                              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>{sectionDisplay}</div>
                            </div>
                          </div>
                          <div className="stats-mobile-card" style={{ gridColumn: 'span 2' }}>
                            <div className="stats-mobile-label">Question</div>
                            <div className="stats-mobile-value">
                              {payload.questionText && payload.questionText.length > 80
                                ? payload.questionText.substring(0, 80) + '...'
                                : payload.questionText || 'N/A'}
                            </div>
                          </div>
                          <div className="stats-mobile-card">
                            <div className="stats-mobile-label">Issue</div>
                            <div className="stats-mobile-value">
                              <span
                                style={{
                                  ...styles.issueTypeBadge,
                                  backgroundColor: '#dc354520',
                                  color: '#dc3545',
                                }}
                              >
                                {getIssueTypeLabel(payload.issueType)}
                              </span>
                            </div>
                          </div>
                          <div className="stats-mobile-card">
                            <div className="stats-mobile-label">Comment</div>
                            <div className="stats-mobile-value" style={{ fontStyle: payload.comment ? 'normal' : 'italic', color: payload.comment ? '#333' : '#999' }}>
                              {payload.comment || 'No comment'}
                            </div>
                          </div>
                          <div className="stats-mobile-card">
                            <div className="stats-mobile-label">User</div>
                            <div className="stats-mobile-value">{payload.userId || 'Anonymous'}</div>
                          </div>
                          <div className="stats-mobile-actions">
                            <button
                              style={styles.resolveButton}
                              onClick={() => handleResolveReport(report.pk)}
                              disabled={isUpdating}
                            >
                              Resolve
                            </button>
                            <button
                              style={styles.deleteButton}
                              onClick={() => handleDeleteReport(report.pk)}
                              disabled={isUpdating}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
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
  mobileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
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
  sourceSectionDetail: {
    marginTop: '4px',
    fontSize: '12px',
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
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
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
  questionCell: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
  issueTypeBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  resolveButton: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.8rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.8rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  tableNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
};

export default Stats;
