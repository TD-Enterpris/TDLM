import {
  ColumnConfig,
  SortDirection,
} from '../../../shared/complex-table/complex-table.component';

export const MEDIA_STORAGE_TYPE_OPTIONS = [
  { label: 'Cloud', value: 'Cloud' },
  { label: 'Physical', value: 'Physical' },
  { label: 'Hybrid', value: 'Hybrid' },
];

export const NEW_COLUMN_CONFIG: Record<string, ColumnConfig> = {
  jurisdiction: { type: 'select', label: 'Jurisdiction' },
  businessArea: { type: 'select', label: 'Business Area' },
  inventoryType: { type: 'select', label: 'Inventory Type' },
  entityType: { type: 'select', label: 'Entity Type' },
  description: { type: 'text', label: 'Description' },
  retentionPeriod: { type: 'text', label: 'Retention Period' },
  effectiveDate: { type: 'date', label: 'Effective Date' },
  mediaStorageType: { type: 'select', label: 'Media Storage Type' },
  expirationDate: { type: 'date', label: 'Expiration Date' },
  policyParameter: { type: 'select', label: 'Policy Parameter' },
  status: {
    type: 'select',
    label: 'Status',
    classFn: (row: { [key: string]: any }): string => {
      if (!row || !row['status']) return '';
      const status = String(row['status']).toLowerCase();
      switch (status) {
        case 'approved':
          return 'status-approved';
        case 'pending':
          return 'status-pending';
        case 'rejected':
          return 'status-rejected';
        default:
          return '';
      }
    },
  },
  actions: { type: 'buttons', label: 'Actions' },
};

export const DEFAULT_VISIBLE_COLUMNS: string[] = [
  'jurisdiction',
  'businessArea',
  'inventoryType',
  'entityType',
  'description',
  'retentionPeriod',
  'effectiveDate',
  'policyParameter',
  'status',
  'actions',
];

export const ID_PROPERTY = 'id';

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required.',
};

export const ADD_FORM_FIELDS = [
  {
    key: 'jurisdiction',
    label: 'Jurisdiction',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'businessArea',
    label: 'Business Area',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'inventoryType',
    label: 'Inventory Type',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'entityType',
    label: 'Entity Type',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'text',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'retentionPeriod',
    label: 'Retention Period',
    type: 'text',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'effectiveDate',
    label: 'Effective Date',
    type: 'date',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'mediaStorageType',
    label: 'Media Storage Type',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'expirationDate',
    label: 'Expiration Date',
    type: 'date',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
  {
    key: 'policyParameter',
    label: 'Policy Parameter',
    type: 'select',
    validators: [{ type: 'required', message: VALIDATION_MESSAGES.REQUIRED }],
  },
];

export const FILTER_ORDER = [
  'jurisdiction',
  'businessArea',
  'inventoryType',
  'entityType',
  'status',
  'policyParameter',
];

export const API_KEY_MAPPING: { [key: string]: string } = {
  jurisdictions: 'jurisdiction',
  businessAreas: 'businessArea',
  inventoryTypes: 'inventoryType',
  entityTypes: 'entityType',
  approvalStatuses: 'status',
  policyTypes: 'policyParameter',
};

export const INITIAL_PAGE_SIZE = 10;
export const INITIAL_SORT_STATE = {
  column: 'jurisdiction',
  direction: SortDirection.ASC,
};

export const MESSAGES = {
  SUCCESS: {
    RESET: 'Filters have been reset successfully.',
    POLICY_ADDED: 'Policy added successfully.',
  },
  WARNING: {
    NO_POLICIES_FOUND: 'No policies found matching your criteria.',
  },
  ERROR: {
    DROPDOWN_LOAD:
      'Failed to load filter options. Please try refreshing the page.',
    SEARCH: 'An error occurred while searching. Please try again.',
    ADD_POLICY: 'Failed to add policy. Please check the errors and try again.',
    OFFLINE:
      'You appear to be offline. Please check your network connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    UNKNOWN:
      'An unexpected error occurred. Please contact support if the issue persists.',
  },
};

export const ANIMATION_CONSTANTS = {
  duration: 0.6,
  yDown: -50,
  yUp: 50,
  scaleX: 0,
  ease: 'power3.out',
  opacityIn: 1,
  opacityOut: 0,
  heightAuto: 'auto',
  heightZero: 0,
  collapse: {
    duration: 0.4,
    ease: 'power3.inOut',
  },
  hide: {
    duration: 0.3,
    ease: 'power3.in',
  },
};
