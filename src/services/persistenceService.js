const BASE_URL = 'https://3plfowqwzi.execute-api.ap-southeast-2.amazonaws.com';
const TENANT_ID = 'tenant-hsc-papers';

const SOURCE_MAP = {
  pastPaper: 'PAST_PAPER',
  studocu: 'STUDOCU',
  civil: 'AI_GENERATED',
  transport: 'AI_GENERATED',
  all: 'AI_GENERATED',
};

const extractCategory = (section) => {
  if (section.startsWith('pastPaper-')) {
    return section;
  }
  if (section.startsWith('studocu-')) {
    return section;
  }
  return section;
};

const extractYear = (section) => {
  if (section.startsWith('pastPaper-')) {
    const match = section.match(/^pastPaper-.+-(\d+.*)$/);
    if (match) return match[1];
  }
  return null;
};

const getQuestionType = (section, questions, totalMCQuestions) => {
  if (section.startsWith('pastPaper-') || section.startsWith('studocu-')) {
    const totalQuestions = questions.length;
    const mcCount = totalMCQuestions;
    const saCount = totalQuestions - mcCount;
    if (mcCount > 0 && saCount > 0) return 'MIXED';
    if (mcCount > 0) return 'MC';
    return 'SA';
  }
  const totalQuestions = questions.length;
  const mcCount = totalMCQuestions;
  const saCount = totalQuestions - mcCount;
  if (mcCount > 0 && saCount > 0) return 'MIXED';
  if (mcCount > 0) return 'MC';
  return 'SA';
};

const getSource = (section) => {
  for (const [key, value] of Object.entries(SOURCE_MAP)) {
    if (section.startsWith(key) || section === key) {
      return value;
    }
  }
  return 'AI_GENERATED';
};

function getSectionTitle(section) {
  if (section.startsWith('pastPaper-')) {
    const match = section.match(/^pastPaper-(.+)-(\d+.*)$/);
    if (match) {
      return `${match[1]} ${match[2].replace(/-/g, ' ').toUpperCase()}`;
    }
  }
  if (section.startsWith('studocu-')) {
    return `Studocu: ${section.replace('studocu-', '')}`;
  }
  if (section === 'all') return 'All Questions';
  if (section === 'civil') return 'Civil Structures';
  if (section === 'transport') return 'Personal & Public Transport';
  return section;
}

export const STATS_SOURCE_LABELS = {
  PAST_PAPER: 'Past Papers',
  AI_GENERATED: 'AI Generated',
  STUDOCU: 'Studocu',
  QUESTION_REPORT: 'Question Reports',
};

export const STATS_SOURCE_COLORS = {
  PAST_PAPER: '#28a745',
  AI_GENERATED: '#007bff',
  STUDOCU: '#f97316',
  QUESTION_REPORT: '#dc3545',
};

export const ISSUE_TYPES = [
  { value: 'wrong_answer', label: 'Wrong Answer' },
  { value: 'ambiguous', label: 'Ambiguous Question' },
  { value: 'typo', label: 'Typo/Grammar Error' },
  { value: 'missing_info', label: 'Missing Information' },
  { value: 'image_issue', label: 'Image Not Loading' },
  { value: 'incorrect_image', label: 'Incorrect Image' },
  { value: 'other', label: 'Other' },
];

export const persistenceService = {
  async saveQuizAttempt({ section, questions, score, totalQuestions, totalMCQuestions }) {
    const source = getSource(section);
    const category = extractCategory(section);
    const yearOrQuestionType = source === 'PAST_PAPER' ? extractYear(section) : getQuestionType(section, questions, totalMCQuestions);
    const timestamp = Date.now();
    const entityId = `${section}-${timestamp}`;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    const sectionTitle = getSectionTitle(section);

    const payload = {
      score,
      totalQuestions,
      percentage,
      section: sectionTitle,
      userId: 'naina',
      attemptedAt: new Date().toISOString(),
    };

    const requestBody = {
      entityType: 'QUIZ_ATTEMPT',
      entityId,
      key1: source,
      key2: category,
      key3: yearOrQuestionType,
      payload,
    };

    console.log('Saving quiz attempt:', requestBody);

    try {
      const response = await fetch(`${BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': TENANT_ID,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Save successful:', data);

      return { success: true, entityId };
    } catch (error) {
      console.error('Failed to save quiz attempt:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllAttempts() {
    try {
      const response = await fetch(`${BASE_URL}/items?entityType=QUIZ_ATTEMPT`, {
        method: 'GET',
        headers: {
          'x-tenant-id': TENANT_ID,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, items: data.items || [] };
    } catch (error) {
      console.error('Failed to fetch attempts:', error);
      return { success: false, error: error.message, items: [] };
    }
  },

  async getAttemptsBySource(source) {
    try {
      const response = await fetch(`${BASE_URL}/items?entityType=QUIZ_ATTEMPT&key1=${source}`, {
        method: 'GET',
        headers: {
          'x-tenant-id': TENANT_ID,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, items: data.items || [] };
    } catch (error) {
      console.error(`Failed to fetch ${source} attempts:`, error);
      return { success: false, error: error.message, items: [] };
    }
  },

  async getAttemptsByCategory(category) {
    try {
      const response = await fetch(`${BASE_URL}/items?entityType=QUIZ_ATTEMPT&key2=${category}`, {
        method: 'GET',
        headers: {
          'x-tenant-id': TENANT_ID,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, items: data.items || [] };
    } catch (error) {
      console.error(`Failed to fetch category ${category} attempts:`, error);
      return { success: false, error: error.message, items: [] };
    }
  },

  async getAttemptsBySourceAndCategory(source, category) {
    try {
      const response = await fetch(
        `${BASE_URL}/items?entityType=QUIZ_ATTEMPT&key1=${source}&key2=${category}`,
        {
          method: 'GET',
          headers: {
            'x-tenant-id': TENANT_ID,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, items: data.items || [] };
    } catch (error) {
      console.error(`Failed to fetch attempts:`, error);
      return { success: false, error: error.message, items: [] };
    }
  },

  async saveQuestionReport({ question, issueType, comment, section }) {
    const source = getSource(section);
    const category = extractCategory(section);
    const userId = 'naina';
    const entityId = `${question.id}-${userId}`;
    
    const payload = {
      questionId: question.id,
      questionText: question.question.substring(0, 100),
      issueType,
      comment: comment || '',
      userId,
      reportedAt: new Date().toISOString(),
      section,
      resolved: false,
    };

    const requestBody = {
      entityType: 'QUESTION_REPORT',
      entityId,
      key1: source,
      key2: category,
      key3: 'MC',
      payload,
    };

    console.log('Saving question report:', requestBody);

    try {
      const response = await fetch(`${BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': TENANT_ID,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Report saved:', data);
      return { success: true, entityId };
    } catch (error) {
      console.error('Failed to save question report:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllReports() {
    try {
      const response = await fetch(`${BASE_URL}/items?entityType=QUESTION_REPORT`, {
        method: 'GET',
        headers: {
          'x-tenant-id': TENANT_ID,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, items: data.items || [] };
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      return { success: false, error: error.message, items: [] };
    }
  },

  async deleteReport(pk) {
    const entityId = pk.split('#').pop();
    console.log('Attempting to delete report:', pk, '-> entityId:', entityId);
    try {
      const response = await fetch(`${BASE_URL}/items/QUESTION_REPORT/${encodeURIComponent(entityId)}`, {
        method: 'DELETE',
        headers: {
          'x-tenant-id': TENANT_ID,
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error response:', errorText);
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      console.log('Report deleted successfully:', entityId);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete report:', error);
      return { success: false, error: error.message };
    }
  },

  async resolveReport(pk, items) {
    const entityId = pk.split('#').pop();
    const item = items.find(i => i.pk === pk);
    if (!item) {
      console.error('Report not found:', pk, items.map(i => i.pk));
      return { success: false, error: 'Report not found' };
    }

    const updatedPayload = {
      ...item.payload,
      resolved: true,
    };

    try {
      const response = await fetch(`${BASE_URL}/items/QUESTION_REPORT/${encodeURIComponent(entityId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': TENANT_ID,
        },
        body: JSON.stringify({
          key1: item.key1,
          key2: item.key2,
          key3: item.key3,
          payload: updatedPayload,
        }),
      });

      console.log('Resolve response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resolve error response:', errorText);
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      console.log('Report resolved successfully:', entityId);
      return { success: true };
    } catch (error) {
      console.error('Failed to resolve report:', error);
      return { success: false, error: error.message };
    }
  },
};
