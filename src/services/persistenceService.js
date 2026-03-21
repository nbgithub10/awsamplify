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
    const match = section.match(/^pastPaper-(.+)-(\d+.*)$/);
    if (match) return match[1];
  }
  if (section.startsWith('studocu-')) {
    return section.replace('studocu-', '');
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
};

export const STATS_SOURCE_COLORS = {
  PAST_PAPER: '#28a745',
  AI_GENERATED: '#007bff',
  STUDOCU: '#f97316',
};
