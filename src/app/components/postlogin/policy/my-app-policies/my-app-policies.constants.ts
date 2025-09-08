// Error keys for type safety and autocomplete
export enum ErrorKey {
  LOAD = 'LOAD',
  SAVE = 'SAVE',
  NO_POLICIES = 'NO_POLICIES',
  NETWORK = 'NETWORK',
  BAD_REQUEST = 'BAD_REQUEST',
  AUTH = 'AUTH',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  CONFLICT = 'CONFLICT',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
  BAD_GATEWAY = 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  GENERIC = 'GENERIC',
  NAVIGATION_FAIL = 'NAVIGATION_FAIL',
}

// Type for error messages
export type ErrorMessages = Record<ErrorKey, string | ((code?: number) => string)>;

// Optimized error messages with dynamic template for GENERIC
export const ERROR_MESSAGES: ErrorMessages = {
  [ErrorKey.NAVIGATION_FAIL]: 'Unable to navigate to policy details. Please try again.',
  [ErrorKey.LOAD]: 'An error occurred while fetching policies. Please try again.',
  [ErrorKey.SAVE]: 'Failed to save policy. Please try again.',
  [ErrorKey.NO_POLICIES]: 'No policies found.',
  [ErrorKey.NETWORK]: 'Network error. Please check your internet connection or try again later.',
  [ErrorKey.BAD_REQUEST]: 'Bad request. Please check your input and try again.',
  [ErrorKey.AUTH]: 'Authentication required. Please log in.',
  [ErrorKey.FORBIDDEN]: 'Access denied. You do not have permission to view these policies.',
  [ErrorKey.NOT_FOUND]: 'Resource not found. The requested policies do not exist.',
  [ErrorKey.TIMEOUT]: 'Request timeout. Please try again.',
  [ErrorKey.CONFLICT]: 'Conflict detected. Please resolve any duplicate or conflicting data.',
  [ErrorKey.PAYLOAD_TOO_LARGE]: 'Payload too large. Please reduce the size of your request.',
  [ErrorKey.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported media type. Please check your file format.',
  [ErrorKey.TOO_MANY_REQUESTS]: 'Too many requests. Please wait and try again later.',
  [ErrorKey.INTERNAL_SERVER]: 'Internal server error. Please try again later.',
  [ErrorKey.BAD_GATEWAY]: 'Bad gateway. The server received an invalid response.',
  [ErrorKey.SERVICE_UNAVAILABLE]: 'Service unavailable. Please try again later.',
  [ErrorKey.GATEWAY_TIMEOUT]: 'Gateway timeout. Please try again later.',
  [ErrorKey.GENERIC]: (code?: number) => `Error${code ? ' ' + code : ''}: Unable to fetch policies.`,
};

// Usage example:
// ERROR_MESSAGES[ErrorKey.GENERIC](404)
import {
  ColumnConfig,
  SortDirection,
  TableRow,
} from '../../../shared/complex-table/complex-table.component';

export const ID_PROPERTY = 'policyId';
export const INITIAL_PAGE_SIZE = 10;
export const INITIAL_SORT_STATE = {
  column: 'policyId',
  direction: SortDirection.ASC,
};

export const EDITABLE_COLUMNS: string[] = [
  'malcode',
  'assetDborCode',
  'recordType',
  'inventoryType',
  'retentionPeriod',
  'effectiveDate',
  'status',
];

export const DEFAULT_VISIBLE_COLUMNS: string[] = [
  'malcode',
  'policyId',
  'assetDborCode',
  'recordType',
  'inventoryType',
  'retentionPeriod',
  'effectiveDate',
  'status',
  'actions',
];

export const COLUMN_CONFIG: Record<string, ColumnConfig> = {
  malcode: { type: 'text', label: 'MAL Code' },
  policyId: { type: 'text', label: 'Policy ID' },
  assetDborCode: { type: 'text', label: 'Asset DBOR Code' },
  recordType: { type: 'text', label: 'Record Type' },
  inventoryType: { type: 'text', label: 'Inventory Type' },
  retentionPeriod: { type: 'text', label: 'Retention Period' },
  effectiveDate: { type: 'date', label: 'Effective Date' },
  status: {
    type: 'chip',
    label: 'Status',
    classFn: (row: TableRow): string => {
      if (!row || !row['status']) return '';
      const status = String(row['status']).toLowerCase();
      return `status-${status}`;
    },
  },
  actions: { type: 'buttons', label: 'Actions' },
};

export const MESSAGES = {
  SUCCESS: {
    POLICY_SAVED: 'Policy saved successfully.',
  },
};

export const ANIMATION_CONSTANTS = {
  duration: 0.6,
  yDown: -50,
  yUp: 50,
  ease: 'power3.out',
  opacityOut: 0,
};
