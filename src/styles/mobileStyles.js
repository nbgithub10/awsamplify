export const mobileStyles = `
  @media (max-width: 768px) {
    /* Stats Page */
    .stats-container {
      padding: 10px !important;
    }
    .stats-title {
      font-size: 1.5rem !important;
    }
    .stats-summary-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.5rem !important;
    }
    .stats-summary-card {
      padding: 0.75rem !important;
    }
    .stats-summary-value {
      font-size: 1.5rem !important;
    }
    .stats-summary-label {
      font-size: 0.7rem !important;
    }
    .stats-section {
      padding: 0.75rem !important;
      margin-bottom: 1rem !important;
    }
    .stats-section-title {
      font-size: 1rem !important;
      margin-bottom: 0.75rem !important;
    }
    .stats-source-grid {
      grid-template-columns: 1fr !important;
      gap: 0.5rem !important;
    }
    .stats-source-card {
      padding: 0.75rem !important;
    }
    .stats-source-label {
      font-size: 0.85rem !important;
    }
    .stats-source-count {
      font-size: 0.75rem !important;
    }
    .stats-source-stat-value {
      font-size: 1rem !important;
    }
    .stats-source-stat-label {
      font-size: 0.7rem !important;
    }
    .stats-table-container {
      display: none !important;
    }
    .stats-mobile-list {
      display: flex !important;
    }
    .stats-mobile-row {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.5rem !important;
    }
    .stats-mobile-card {
      background: #f8f9fa !important;
      padding: 0.75rem !important;
      border-radius: 8px !important;
      font-size: 0.8rem !important;
    }
    .stats-mobile-label {
      font-weight: bold !important;
      color: #666 !important;
      font-size: 0.7rem !important;
      margin-bottom: 0.25rem !important;
    }
    .stats-mobile-value {
      color: #333 !important;
    }
    .stats-mobile-actions {
      display: flex !important;
      gap: 0.5rem !important;
      grid-column: span 2 !important;
      justify-content: flex-end !important;
      margin-top: 0.5rem !important;
    }
    .stats-source-badge {
      font-size: 0.65rem !important;
      padding: 0.15rem 0.3rem !important;
    }
    .stats-issue-badge {
      font-size: 0.65rem !important;
      padding: 0.15rem 0.3rem !important;
    }
    .stats-action-btn {
      padding: 0.25rem 0.4rem !important;
      font-size: 0.7rem !important;
    }
    .stats-filters {
      flex-direction: column !important;
      width: 100% !important;
    }
    .stats-filters select {
      width: 100% !important;
    }
    .stats-back-btn {
      padding: 0.4rem 0.8rem !important;
      font-size: 0.85rem !important;
    }
    .stats-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.5rem !important;
    }
    .stats-section-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.5rem !important;
    }
    .stats-source-header {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .stats-source-stats {
      gap: 1rem !important;
    }

    /* Home Page StatsBar */
    .stats-bar {
      flex-direction: column !important;
      gap: 0.5rem !important;
      padding: 0.75rem !important;
    }
    .stat-divider {
      display: none !important;
    }
    .stat-item {
      flex-direction: row !important;
      justify-content: space-between !important;
      width: 100% !important;
      min-width: unset !important;
      padding: 0.25rem 0 !important;
    }
    .stat-value {
      font-size: 1.2rem !important;
    }
    .stat-label {
      font-size: 0.7rem !important;
    }
  }
`;
