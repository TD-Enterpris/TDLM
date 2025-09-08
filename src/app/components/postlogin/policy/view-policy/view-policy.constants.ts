export enum ViewPolicyErrorKey {
  LOAD = 'LOAD',
  SAVE = 'SAVE',
  NO_POLICY = 'NO_POLICY',
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
  BACK_BUTTON_FAIL = 'BACK_BUTTON_FAIL',
  DATE_BIND_FAIL = 'DATE_BIND_FAIL',
  SAVE_API_FAIL = 'SAVE_API_FAIL',
}

export type ViewPolicyErrorMessages = Record<ViewPolicyErrorKey, string | ((code?: number) => string)>;

export const VIEW_POLICY_ERROR_MESSAGES: ViewPolicyErrorMessages = {
  [ViewPolicyErrorKey.NAVIGATION_FAIL]: 'Unable to navigate to policy details. Please try again.',
  [ViewPolicyErrorKey.BACK_BUTTON_FAIL]: 'Unable to go back. Please try again or return to the dashboard.',
  [ViewPolicyErrorKey.DATE_BIND_FAIL]: 'Unable to bind the selected date. Please choose a valid date and try again.',
  [ViewPolicyErrorKey.SAVE_API_FAIL]: 'Failed to save changes due to a server error. Please try again later or contact support.',
  [ViewPolicyErrorKey.LOAD]: 'An error occurred while fetching policy details. Please try again.',
  [ViewPolicyErrorKey.SAVE]: 'Failed to save policy details. Please try again.',
  [ViewPolicyErrorKey.NO_POLICY]: 'No policy found.',
  [ViewPolicyErrorKey.NETWORK]: 'Network error. Please check your internet connection or try again later.',
  [ViewPolicyErrorKey.BAD_REQUEST]: 'Bad request. Please check your input and try again.',
  [ViewPolicyErrorKey.AUTH]: 'Authentication required. Please log in.',
  [ViewPolicyErrorKey.FORBIDDEN]: 'Access denied. You do not have permission to view this policy.',
  [ViewPolicyErrorKey.NOT_FOUND]: 'Resource not found. The requested policy does not exist.',
  [ViewPolicyErrorKey.TIMEOUT]: 'Request timeout. Please try again.',
  [ViewPolicyErrorKey.CONFLICT]: 'Conflict detected. Please resolve any duplicate or conflicting data.',
  [ViewPolicyErrorKey.PAYLOAD_TOO_LARGE]: 'Payload too large. Please reduce the size of your request.',
  [ViewPolicyErrorKey.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported media type. Please check your file format.',
  [ViewPolicyErrorKey.TOO_MANY_REQUESTS]: 'Too many requests. Please wait and try again later.',
  [ViewPolicyErrorKey.INTERNAL_SERVER]: 'Internal server error. Please try again later.',
  [ViewPolicyErrorKey.BAD_GATEWAY]: 'Bad gateway. The server received an invalid response.',
  [ViewPolicyErrorKey.SERVICE_UNAVAILABLE]: 'Service unavailable. Please try again later.',
  [ViewPolicyErrorKey.GATEWAY_TIMEOUT]: 'Gateway timeout. Please try again later.',
  [ViewPolicyErrorKey.GENERIC]: (code?: number) => `Error${code ? ' ' + code : ''}: Unable to fetch policy details.`,
};
import { TemplateRef } from '@angular/core';
import { ColumnConfig, TableRow } from '../../../shared/complex-table/complex-table.component';

export const ANIMATION_CONSTANTS = {
  duration: 0.6,
  yDown: -50,
  yUp: 50,
  xLeft: -50,
  xRight: 50,
  ease: 'power3.out',
  opacityOut: 0,
  datePickerY: 20,
  datePickerInDuration: 0.5,
  datePickerOutDuration: 0.25,
  modalYIn: -20,
  modalYOut: 20,
  modalInDuration: 0.3,
  modalOutDuration: 0.3,
  modalEaseIn: 'power2.out',
  modalEaseOut: 'power2.in',
};

export const INFO_DEFAULT_VISIBLE_COLUMNS: string[] = ['malcode', 'policyId', 'assetDborCode', 'status', 'actions'];
export const APPROVERS_DEFAULT_VISIBLE_COLUMNS: string[] = ['approvalGroup', 'status', 'approverId', 'decisionDate', 'comments'];

export const INFO_COLUMN_CONFIG: Record<string, ColumnConfig> = {
  malcode: { type: 'text', label: 'Malcode' },
  policyId: { type: 'text', label: 'PolicyID' },
  assetDborCode: { type: 'text', label: 'Asset DBoR Code' },
  status: {
    type: 'chip',
    label: 'Status',
    classFn: (row: TableRow): string => {
      if (!row || !row['status']) return '';
      const status = String(row['status']).toLowerCase();
      return `status-${status}`;
    },
  },
  actions: {
    type: 'buttons',
    label: 'Actions',
    buttons: () => [
      { action: 'approve', label: 'Approve', spanIcon: 'td-icon-18x18-check-circle-o', title: 'Approve Policy' },
      { action: 'reject', label: 'Reject', spanIcon: 'td-icon-18x18-close-circle-o', title: 'Reject Policy' },
      { action: 'edit', label: 'Edit', spanIcon: 'td-icon-18x18-edit', title: 'Edit Policy' }
    ]
  }
};

export const APPROVERS_COLUMN_CONFIG: Record<string, ColumnConfig> = {
  approvalGroup: { type: 'text', label: 'Approval Group' },
  status: {
    type: 'chip',
    label: 'Status',
    classFn: (row: TableRow): string => {
      if (!row || !row['status']) return '';
      const status = String(row['status']).toLowerCase();
      return `status-${status}`;
    },
  },
  approverId: { type: 'text', label: 'Approver ID' },
  created: { type: 'text', label: 'Created' },
  decisionDate: { type: 'text', label: 'Decision Date' },
  comments: { type: 'text', label: 'Comments' }
};

export const createAccordionData = (currentPolicy: any): any[][] => {
  if (!currentPolicy) return [];

  const now = new Date();
  const historyEvents = [
    { date: currentPolicy.createdDate, label: 'Created Date', details: `by ${currentPolicy.createdBy}`, icon: 'td-icon-18x18-plus-circle' },
    { date: currentPolicy.updatedDate, label: 'Updated Date', details: `by ${currentPolicy.updatedBy}`, icon: 'td-icon-18x18-edit' },
    { date: currentPolicy.effectiveDate, label: 'Effective Date', details: 'Policy is now in effect.', icon: 'td-icon-18x18-calendar' },
    { date: currentPolicy.expirationDate, label: 'Expiration Date', details: 'Policy will no longer be active.', icon: 'td-icon-18x18-close-circle' }
  ];

  const sortedTimelineEvents = historyEvents
    .filter(event => event.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(event => {
      const eventDate = new Date(event.date);
      return {
        ...event,
        date: eventDate,
        title: eventDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    });

  const eventsWithStatus = sortedTimelineEvents.map(event => ({
    ...event,
    status: event.date <= now ? 'completed' : 'pending',
  }));

  const lastCompletedIndex = eventsWithStatus.map(e => e.status).lastIndexOf('completed');

  if (lastCompletedIndex !== -1) {
    eventsWithStatus[lastCompletedIndex].status = 'active';
  }

  const finalEvents = eventsWithStatus;

  const policyDetailsSection = {
    title: 'Policy Details',
    type: 'fields',
    fields: [
      { label: 'Jurisdiction', value: currentPolicy.jurisdiction },
      { label: 'Business Area', value: currentPolicy.businessArea },
      { label: 'Inventory Type', value: currentPolicy.inventoryType },
      { label: 'Record Type', value: currentPolicy.recordType },
      { label: 'Business Capability', value: currentPolicy.businessCapability },
      { label: 'Media Storage Type', value: currentPolicy.mediaStorageType }
    ]
  };

  const retentionSection = {
    title: 'Retention Parameters',
    type: 'fields',
    fields: [
      { label: 'Retention Code', value: currentPolicy.retentionCode },
      { label: 'Retention Trigger', value: currentPolicy.retentionTrigger },
      { label: 'Retention Period', value: currentPolicy.retentionPeriod }
    ]
  };

  const historySection = {
    title: 'History',
    type: 'timeline',
    description: currentPolicy.description,
    timelineEvents: finalEvents
  };

  return [
    [policyDetailsSection, retentionSection],
    [historySection]
  ];
};

export const VIEW_POLICY_TEXT = {
  loadingHeading: 'Loading Policy Details...',
  loadingMessage: 'Fetching policy data from the server',
  infoTableTitle: 'Policy details',
  approversTableTitle: 'Approvers',
  editExpirationLabel: 'Edit Expiration Date',
  saveButton: 'Save',
  cancelButton: 'Cancel',
  confirmSaveTitle: 'Confirm Save',
  confirmSaveMessage: 'Are you sure you want to save these changes?',
  temporalSuccess: 'Expiration date updated successfully.',
  temporalError: 'Failed to update expiration date.',
  temporalErrorGeneric: 'Error updating expiration date.'
};

export const TEMPORAL_MESSAGE_DURATION = 2500;
