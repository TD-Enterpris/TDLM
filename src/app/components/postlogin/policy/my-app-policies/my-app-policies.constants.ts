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
    type: 'select',
    label: 'Status',
    classFn: (row: TableRow): string => {
      if (!row || !row['status']) return '';
      const status = String(row['status']).toLowerCase();
      switch (status) {
        case 'approved': return 'status-approved';
        case 'pending': return 'status-pending';
        case 'rejected': return 'status-rejected';
        default: return '';
      }
    },
  },
  actions: { type: 'buttons', label: 'Actions' },
};

export const MESSAGES = {
  SUCCESS: {
    POLICY_SAVED: 'Policy saved successfully.',
  },
  ERROR: {
    LOAD: 'An error occurred while fetching policies. Please try again.',
    SAVE: 'Failed to save policy. Please try again.',
  },
};

export const ANIMATION_CONSTANTS = {
  duration: 0.6,
  yDown: -50,
  yUp: 50,
  ease: 'power3.out',
  opacityOut: 0,
};