/**
 * Helper to manage version mappings and metadata for all templates.
 */

const metadata = {
  resumeOptimization: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'Standard STAR optimization prompt.',
      models: ['google/gemini-flash-1.5', 'meta-llama/llama-3.2-3b-instruct:free']
    }
  },
  atsAnalysis: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'Core ATS parsing scan prompt.',
      models: ['google/gemini-flash-1.5', 'meta-llama/llama-3.2-3b-instruct:free']
    }
  },
  jobDescriptionAnalysis: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'Job compatibility keyword parser.',
      models: ['google/gemini-flash-1.5', 'meta-llama/llama-3.2-3b-instruct:free']
    }
  },
  resumeRewrite: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'STAR description enhance compiler.',
      models: ['google/gemini-flash-1.5']
    }
  },
  chat: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'Career counselling conversational guide.',
      models: ['google/gemini-flash-1.5']
    }
  },
  coldEmail: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'Recruiter outreach formatting blueprint.',
      models: ['google/gemini-flash-1.5']
    }
  },
  jobSuggestions: {
    v1: {
      version: '1.0.0',
      createdDate: '2026-07-26',
      description: 'Job listings portal suggestions compiler.',
      models: ['google/gemini-flash-1.5']
    }
  }
};

const getMetadata = (promptName, version = 'v1') => {
  return metadata[promptName]?.[version] || {
    version: '1.0.0-default',
    createdDate: new Date().toISOString().split('T')[0],
    description: 'Auto-fallback prompt template.',
    models: []
  };
};

module.exports = {
  getMetadata
};
