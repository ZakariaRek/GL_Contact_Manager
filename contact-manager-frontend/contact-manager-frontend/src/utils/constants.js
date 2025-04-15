export const ROUTES = {
  HOME: '/',
  CONTACTS: '/contacts',
  CONTACT_DETAIL: '/contacts/:id',
  CONTACT_NEW: '/contacts/new',
  CONTACT_EDIT: '/contacts/edit/:id',
  GROUPS: '/groups',
  GROUP_NEW: '/groups/new',
  GROUP_EDIT: '/groups/edit/:id',
  SETTINGS: '/settings',
  NOT_FOUND: '*'
};

export const COLORS = [
  '#4285F4', // Blue
  '#0F9D58', // Green
  '#F4B400', // Yellow
  '#DB4437', // Red
  '#673AB7', // Purple
  '#FF6D00', // Orange
  '#00ACC1', // Cyan
  '#9E9E9E', // Gray
];

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: 'lastName',
  SORT_ORDER: 'asc'
};

export const PHONE_REGEX = /^\+?[\d\s()-]{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;
