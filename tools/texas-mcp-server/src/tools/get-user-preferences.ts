export async function getUserPreferences() {
  return {
    preferences: {
      alwaysInclude: ['tests'],
      recommendedInclude: ['documentation updates', 'CHANGELOG entries'],
      neverSkip: ['linting', 'type checking'],
    },
    workflow: {
      commits:
        'NEVER commit changes unless explicitly requested by the user. This is CRITICAL and must NEVER be bypassed.',
      changeProcess: 'Make changes → User reviews → User explicitly requests commit',
      note: 'User may want to add more changes or review diffs before committing',
    },
  };
}
