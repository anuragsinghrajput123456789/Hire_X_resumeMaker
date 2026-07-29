/**
 * Centralized Application Constants & Configuration Settings
 */

export const COVER_LETTER_TONES = [
  'Professional',
  'Friendly',
  'Confident',
  'Executive',
  'Concise',
  'Enthusiastic',
  'Creative',
] as const;

export const COVER_LETTER_LENGTHS = [
  'Short',
  'Medium',
  'Detailed',
] as const;

export const EXPERIENCE_LEVELS = [
  'Student',
  'Fresher',
  'Junior',
  'Mid-Level',
  'Senior',
  'Executive',
] as const;

export const INTERVIEW_TYPES = [
  'Technical',
  'Behavioral',
  'System Design',
  'HR / Soft Skills',
  'Leadership',
] as const;

export const INTERVIEW_DIFFICULTIES = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Staff / Principal',
] as const;

export const JOB_APPLICATION_STATUSES = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
] as const;

export const DEFAULT_AI_TIMEOUT = 60_000;
export const DEFAULT_REQUEST_TIMEOUT = 30_000;
