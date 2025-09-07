import { TemplateRef } from '@angular/core';
import { ColumnConfig, TableRow } from '../../../shared/complex-table/complex-table.component';

export const ANIMATION_CONSTANTS = {
  duration: 0.6,
  yDown: -50,
  yUp: 50,
  ease: 'power3.out',
  opacityOut: 0,
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
