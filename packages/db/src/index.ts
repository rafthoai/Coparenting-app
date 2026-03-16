export const dbDomains = [
  'users',
  'households',
  'children',
  'rules',
  'schedule',
  'requests',
  'messages',
  'expenses',
  'timeline',
  'notifications',
  'ai-artifacts',
  'audit'
] as const;

export const initialSchemaScope = [
  'foundation-entities',
  'custody-and-rule-engine-core',
  'calendar-and-generated-schedule-outputs',
  'conflicts-and-auditability'
] as const;
