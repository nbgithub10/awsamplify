import React, { useState, useEffect, useMemo } from 'react';
import { persistenceService, STATS_SOURCE_LABELS, STATS_SOURCE_COLORS, ISSUE_TYPES } from '../services/persistenceService';

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
    const [attemptsResult, reportsResult] = await Promise.all([
      persistenceService.getAllAttempts(),
      persistenceService.getAllReports(),
    ]);
    setLoading(false);
    
    if (attemptsResult.success) {
      setAttempts(attemptsResult.items);
    } else {
      setError(attemptsResult.error);
    }
    
    if (reportsResult.success) {
      setReports(reportsResult.items);
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
    let worstScore = 100;
    const bySource = {};
    const byCategory = {};

    uniqueAttempts.forEach((item) => {
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

    return {
      totalQuizzes: uniqueAttempts.length,
      totalScore,
      totalQuestions,
      averagePercentage: totalQuestions > 0 ? Math.round(totalScore / totalQuestions * 100) : 0,
      bestScore,
      worstScore: worstScore === 100 ? 0 : worstScore,
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
    console.log('Resolving report:', entityId);
    setIsUpdating(true);
    try {
      const result = await persistenceService.resolveReport(entityId, reports);
      console.log('Resolve result:', result);
      if (result.success) {
        setReports(prev => prev.map(r => 
          r.pk === entityId ? { ...r, payload: { ...r.payload, resolved: true } } : r
        ));
      }
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
    setIsUpdating(false);
  };

  const handleDeleteReport = async (entityId) => {
    console.log('Deleting report:', entityId);
    setIsUpdating(true);
    try {
      const result = await persistenceService.deleteReport(entityId);
      console.log('Delete result:', result);
      if (result.success) {
        setReports(prev => prev.filter(r => r.pk !== entityId));
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
    setIsUpdating(false);
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

      {attempts.length === 0 && activeReports.length === 0 ? (
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
          {attempts.length > 0 && (
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

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Question Reports ({activeReports.length})</h2>
            {activeReports.length === 0 ? (
              <p style={styles.emptyText}>No reported issues yet.</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
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
                            <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                              {sectionDisplay}
                            </div>
                          </td>
                          <td style={{ ...styles.tableCell, maxWidth: '200px' }}>
                            <span title={payload.questionText}>{payload.questionText}</span>
                          </td>
                          <td style={styles.tableCell}>
                            <span style={{ ...styles.issueTypeBadge, backgroundColor: '#dc354520', color: '#dc3545' }}>
                              {getIssueTypeLabel(payload.issueType)}
                            </span>
                          </td>
                          <td style={{ ...styles.tableCell, fontStyle: payload.comment ? 'normal' : 'italic', color: '#999' }}>
                            {payload.comment || 'No comment'}
                          </td>
                          <td style={styles.tableCell}>{payload.userId}</td>
                          <td style={styles.tableCell}>
                            <div style={styles.actionButtons}>
                              <button
                                style={styles.resolveButton}
                                onClick={() => handleResolveReport(report.pk)}
                                disabled={isUpdating}
                                title="Mark as resolved (hide from list)"
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
            )}
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
