import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ComplexTableComponent,
  ColumnConfig,
  SortDirection,
  TableRow,
} from '../../../shared/complex-table/complex-table.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SelectDropdownComponent } from '../../../shared/select-dropdown/select-dropdown.component';
import { TemporalMessageComponent } from '../../../shared/temporal-message/temporal-message.component';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { DateComponent } from '../../../shared/date/date.component';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

import {
  MEDIA_STORAGE_TYPE_OPTIONS,
  NEW_COLUMN_CONFIG,
  DEFAULT_VISIBLE_COLUMNS,
  ANIMATION_CONSTANTS,
  ID_PROPERTY,
  INITIAL_PAGE_SIZE,
  INITIAL_SORT_STATE,
  MESSAGES,
  ADD_FORM_FIELDS,
  FILTER_ORDER,
  API_KEY_MAPPING,
} from './policy-dashboard.constants';

import {
  PolicyDashboardService,
  NewPolicy,
} from '../../../../services/api/policy-dashboard.service';
import { InputComponent } from '../../../shared/input/input.component';

interface DynamicFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
}

@Component({
  selector: 'app-policy-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComplexTableComponent,
    PaginationComponent,
    ButtonComponent,
    SelectDropdownComponent,
    TemporalMessageComponent,
    SpinnerComponent,
    InputComponent,
    DateComponent,
    DialogComponent,
  ],
  templateUrl: './policy-dashboard.component.html',
  styleUrls: ['./policy-dashboard.component.css'],
})
export class PolicyDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('section1') section1!: ElementRef;
  @ViewChild('section2') section2!: ElementRef;
  @ViewChild('section3') section3!: ElementRef;
  @ViewChild('addSection') addSection!: ElementRef;
  @ViewChild('collapsibleContent') collapsibleContent!: ElementRef;
  @ViewChild('confirmationDialog') confirmationDialog!: DialogComponent;

  private subscriptions: Subscription = new Subscription();

  public pagedPolicyData: any[] = [];
  public columnConfig: Record<string, ColumnConfig> = {};
  public defaultVisibleColumns: string[] = DEFAULT_VISIBLE_COLUMNS;
  public idProperty = ID_PROPERTY;

  public totalRecords: number = 0;
  public pageSize: number = INITIAL_PAGE_SIZE;
  public currentPageNumber: number = 0;
  public sortState: { column: string; direction: SortDirection } = {
    ...INITIAL_SORT_STATE,
  };

  public dynamicFilters: DynamicFilter[] = [];

  public formMode: 'search' | 'add' | 'edit' = 'search';
  private originalEditPolicy: NewPolicy | null = null;
  public newPolicy!: NewPolicy;
  public addFormFields = ADD_FORM_FIELDS;
  public isSearchCollapsed = false;
  public formErrors: { [key: string]: string } = {};

  public message: string = '';
  public messageType: 'success' | 'warning' | 'danger' | 'info' = 'info';
  public isLoading: boolean = true;
  private isInitialLoad = true;

  public mediaStorageTypeOptions = MEDIA_STORAGE_TYPE_OPTIONS;

  public confirmationDialogTitle = '';
  public confirmationDialogMessage = '';
  private pendingAction: (() => void) | null = null;

  constructor(
    private policyService: PolicyDashboardService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeNewPolicy();
  }

  ngOnInit(): void {
    this.initializeColumnConfig();
    this.loadDropdownOptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getOptionsForField(key: string): { value: string; label: string }[] {
    const filter = this.dynamicFilters.find((f) => f.key === key);
    return filter ? filter.options : [];
  }

  public get areFiltersActive(): boolean {
    return this.dynamicFilters.some((filter) => !!filter.selectedValue);
  }

  public get isNewPolicyDirty(): boolean {
    return Object.values(this.newPolicy).some((value) => !!value);
  }

  public get isEditFormDirty(): boolean {
    if (this.formMode !== 'edit' || !this.originalEditPolicy) {
      return false;
    }
    return JSON.stringify(this.newPolicy) !== JSON.stringify(this.originalEditPolicy);
  }

  private initializeColumnConfig(): void {
    this.columnConfig = {
      ...NEW_COLUMN_CONFIG,
      actions: {
        type: 'buttons',
        label: 'Actions',
        buttons: (row: TableRow) => [
          {
            action: 'edit',
            label: 'Edit',
            spanIcon: 'td-icon-18x18-edit',
            title: 'Edit policy',
          },
          {
            action: 'approve',
            label: 'Approve',
            spanIcon: 'td-icon-18x18-check-circle-o',
            title: 'Approve policy',
          },
          {
            action: 'reject',
            label: 'Reject',
            spanIcon: 'td-icon-18x18-close-circle-o',
            title: 'Reject policy',
          },
        ],
      },
    };
  }

  private setFormMode(mode: 'search' | 'add' | 'edit'): void {
    this.formMode = mode;

    if (mode === 'edit') {
      this.defaultVisibleColumns = DEFAULT_VISIBLE_COLUMNS.filter(
        (col) => col !== 'actions'
      );
    } else {
      this.defaultVisibleColumns = DEFAULT_VISIBLE_COLUMNS;
    }
  }

  public onActionTriggered(event: { action: string; row: TableRow }): void {
    const { action, row } = event;

    switch (action) {
      case 'edit':
        this.handleEdit(row);
        break;
      case 'approve':
        this.handleApprove(row);
        break;
      case 'reject':
        this.handleReject(row);
        break;
    }
  }

  private handleEdit(row: TableRow): void {
    this.originalEditPolicy = { ...row } as NewPolicy;
    this.newPolicy = { ...row } as NewPolicy;
    this.formErrors = {};
    this.setFormMode('edit');
    this.cdr.detectChanges();

    if (this.isSearchCollapsed) {
      this.isSearchCollapsed = false;
    }

    setTimeout(() => {
      const el = this.collapsibleContent.nativeElement;
      el.style.display = 'block';
      this.animateContainerToAutoHeight();
      this.playAddFormAnimation();
    }, 0);
  }

  private handleApprove(row: TableRow): void {
    this.showMessage(`Policy ${row[this.idProperty]} approved.`, 'success');
  }

  private handleReject(row: TableRow): void {
    this.showMessage(`Policy ${row[this.idProperty]} rejected.`, 'danger');
  }

  private loadDropdownOptions(): void {
    this.subscriptions.add(
      this.policyService.getDropdownOptions().subscribe({
        next: (response) => {
          this.dynamicFilters = [];
          if (response && response.data) {
            const responseData = response.data;
            for (const apiOrderKey of FILTER_ORDER) {
              const apiKey = Object.keys(API_KEY_MAPPING).find(
                (k) => API_KEY_MAPPING[k] === apiOrderKey
              );

              if (apiKey && responseData[apiKey]) {
                this.dynamicFilters.push({
                  key: apiOrderKey,
                  label: this.formatKeyToLabel(apiOrderKey),
                  options: responseData[apiKey].map((val: string) => ({
                    value: val,
                    label: val,
                  })),
                  selectedValue: '',
                });
              }
            }
          }

          this.dynamicFilters.forEach((filter) => {
            if (
              this.columnConfig[filter.key] &&
              this.columnConfig[filter.key].type === 'select'
            ) {
              this.columnConfig[filter.key].options = filter.options;
            }
          });

          if (this.columnConfig['mediaStorageType']) {
            this.columnConfig['mediaStorageType'].options =
              MEDIA_STORAGE_TYPE_OPTIONS;
          }
          this.cdr.markForCheck();
          this.onSearch();
        },
        error: (err: HttpErrorResponse) => {
          this.handleApiError(err, 'dropdown');
        },
      })
    );
  }

  public onSearchButtonClick(): void {
    this.expandSearchCollapse();
    this.onSearch();
  }

  public onSearch(): void {
    const activeEl = document.activeElement as HTMLElement;
    let focusedElementAriaLabel: string | null = null;

    if (activeEl?.tagName === 'BUTTON') {
      const ariaLabel = activeEl.getAttribute('aria-label');
      if (ariaLabel === 'Reload Data' || ariaLabel?.startsWith('Sort by ')) {
        focusedElementAriaLabel = ariaLabel;
      }
    }

    this.message = '';
    this.isLoading = true;

    const filters: { [key: string]: any } = {};
    this.dynamicFilters.forEach((filter) => {
      if (filter.selectedValue) {
        filters[filter.key] = filter.selectedValue;
      }
    });

    filters['page'] = this.currentPageNumber;
    filters['size'] = this.pageSize;
    filters['sortBy'] = this.sortState?.column;
    filters['direction'] = this.sortState?.direction || 'asc';

    const restoreFocus = () => {
      if (focusedElementAriaLabel) {
        setTimeout(() => {
          const elementToFocus = document.querySelector(
            `button[aria-label="${focusedElementAriaLabel}"]`
          ) as HTMLElement;
          if (elementToFocus) {
            elementToFocus.focus();
          }
        }, 0);
      }
    };

    this.subscriptions.add(
      this.policyService.getPolicies(filters).subscribe({
        next: (response) => {
          this.pagedPolicyData = [...response.data.content];
          this.totalRecords = response.data.totalElements;
          this.currentPageNumber = response.data.number;

          if (this.pagedPolicyData.length === 0 && !this.isInitialLoad) {
            this.showMessage(MESSAGES.WARNING.NO_POLICIES_FOUND, 'warning');
          }

          this.isLoading = false;

          if (this.isInitialLoad) {
            setTimeout(() => {
              this.playInitialAnimations();
              this.isInitialLoad = false;
            });
          }
          this.cdr.detectChanges();
          restoreFocus();
        },
        error: (err: HttpErrorResponse) => {
          this.handleApiError(err, 'search');
          this.isLoading = false;
          this.cdr.detectChanges();
          restoreFocus();
        },
      })
    );
  }

  public onReset(): void {
    this.dynamicFilters.forEach((filter) => (filter.selectedValue = ''));
    this.currentPageNumber = 0;
    this.sortState = { ...INITIAL_SORT_STATE };
    this.onSearch();
  }

  public onAddPolicy(): void {
    this.setFormMode('add');
    this.initializeNewPolicy();
    this.formErrors = {};
    this.cdr.detectChanges();

    if (this.isSearchCollapsed) {
      this.isSearchCollapsed = false;
    }

    setTimeout(() => {
      const el = this.collapsibleContent.nativeElement;
      el.style.display = 'block';
      this.animateContainerToAutoHeight();
      this.playAddFormAnimation();

      const addForm = this.addSection.nativeElement;
      const firstFocusable = addForm.querySelector(
        'input, select, button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        (firstFocusable as HTMLElement).focus();
      }
    }, 0);
  }

  public onCancelForm(): void {
    if (this.isEditFormDirty) {
      this.confirmationDialogTitle = 'Unsaved Changes';
      this.confirmationDialogMessage = 'You have unsaved changes. Are you sure you want to cancel?';
      this.pendingAction = () => this.proceedWithCancel();
      this.confirmationDialog.open();
    } else {
      this.proceedWithCancel();
    }
  }

  public onClearAddForm(): void {
    this.initializeNewPolicy();
    this.formErrors = {};
  }

  public onDateChange(key: string, values: { date: string }): void {
    (this.newPolicy as any)[key] = values.date;
    if (values.date && this.formErrors[key]) {
      delete this.formErrors[key];
    }
  }

  public onSaveAdd(): void {
    if (!this.validateForm()) {
      this.showMessage(MESSAGES.ERROR.ADD_POLICY, 'danger');
      return;
    }
    this.isLoading = true;
    this.subscriptions.add(
      this.policyService.createPolicy(this.newPolicy).subscribe({
        next: (response) => {
          this.pagedPolicyData.unshift(response.data);
          this.totalRecords++;
          this.showMessage(MESSAGES.SUCCESS.POLICY_ADDED, 'success');
          this.playHideAddFormAnimation(() => {
            this.setFormMode('search');
            this.isLoading = false;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.animateContainerToAutoHeight();
              this.playSearchFormAnimation();
            }, 0);
          });
        },
        error: (err: HttpErrorResponse) => {
          this.handleApiError(err, 'add');
          this.isLoading = false;
        },
      })
    );
  }

  public onSaveEdit(): void {
    if (this.isEditFormDirty) {
      this.confirmationDialogTitle = 'Confirm Update';
      this.confirmationDialogMessage = 'Are you sure you want to update this policy?';
      this.pendingAction = () => this.proceedWithSave();
      this.confirmationDialog.open();
    } else {
      this.showMessage('No changes detected to save.', 'info');
    }
  }

  public onConfirmationYes(): void {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.pendingAction = null;
    this.confirmationDialog.close();
  }

  public onConfirmationNo(): void {
    this.pendingAction = null;
    this.confirmationDialog.close();
  }

  private proceedWithCancel(): void {
    this.setFormMode('search');
    if (this.isSearchCollapsed) {
      this.isSearchCollapsed = false;
    }
    this.cdr.detectChanges();

    setTimeout(() => {
      const el = this.collapsibleContent.nativeElement;
      el.style.display = 'block';
      this.animateContainerToAutoHeight();
      this.playSearchFormAnimation();

      const searchForm = this.section1.nativeElement;
      const firstFocusable = searchForm.querySelector(
        'input, select, button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        (firstFocusable as HTMLElement).focus();
      }
    }, 0);
  }

  private proceedWithSave(): void {
    if (!this.validateForm()) {
      this.showMessage('Failed to update policy. Please check errors.', 'danger');
      return;
    }
    this.isLoading = true;
    const policyToUpdate = this.newPolicy as any;
    const policyId = policyToUpdate.id;

    // NOTE: Assumes your PolicyDashboardService has an `updatePolicy` method.
    // this.policyService.updatePolicy(policyId, policyToUpdate).subscribe({ ... });

    // --- MOCKED RESPONSE FOR DEMONSTRATION ---
    // Replace this setTimeout with your actual service call
    setTimeout(() => {
      const index = this.pagedPolicyData.findIndex(p => p.id === policyId);
      if (index > -1) {
        this.pagedPolicyData[index] = policyToUpdate;
        this.pagedPolicyData = [...this.pagedPolicyData];
      }
      this.showMessage('Policy updated successfully.', 'success');
      this.playHideAddFormAnimation(() => {
        this.setFormMode('search');
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.animateContainerToAutoHeight();
          this.playSearchFormAnimation();
        }, 0);
      });
    }, 1000);
    // --- END MOCKED RESPONSE ---
  }

  private validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;
    for (const field of ADD_FORM_FIELDS) {
      if (field.validators) {
        for (const validator of field.validators) {
          if (
            validator.type === 'required' &&
            !this.newPolicy[field.key as keyof NewPolicy]
          ) {
            this.formErrors[field.key] = validator.message;
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  public onPageChange(page: number): void {
    if (page === this.currentPageNumber) return;
    this.currentPageNumber = page;
    this.onSearch();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPageNumber = 0;
    this.onSearch();
  }

  public onSortChanged(event: {
    column: string;
    direction: SortDirection;
  }): void {
    this.sortState = event;
    this.onSearch();
  }

  public toggleSearchCollapse(): void {
    this.isSearchCollapsed = !this.isSearchCollapsed;
    const el = this.collapsibleContent.nativeElement;

    if (this.isSearchCollapsed) {
      gsap.to(el, {
        height: ANIMATION_CONSTANTS.heightZero,
        opacity: ANIMATION_CONSTANTS.opacityOut,
        duration: ANIMATION_CONSTANTS.collapse.duration,
        ease: ANIMATION_CONSTANTS.collapse.ease,
        onComplete: () => {
          el.style.display = 'none';
        },
      });
    } else {
      el.style.display = 'block';
      gsap.set(el, {
        height: ANIMATION_CONSTANTS.heightAuto,
        opacity: ANIMATION_CONSTANTS.opacityIn,
      });
      gsap.from(el, {
        height: ANIMATION_CONSTANTS.heightZero,
        opacity: ANIMATION_CONSTANTS.opacityOut,
        duration: ANIMATION_CONSTANTS.collapse.duration,
        ease: ANIMATION_CONSTANTS.collapse.ease,
      });
    }
  }

  private expandSearchCollapse(): void {
    if (!this.isSearchCollapsed) {
      return;
    }

    this.isSearchCollapsed = false;
    const el = this.collapsibleContent.nativeElement;

    el.style.display = 'block';
    gsap.set(el, {
      height: ANIMATION_CONSTANTS.heightAuto,
      opacity: ANIMATION_CONSTANTS.opacityIn,
    });
    gsap.from(el, {
      height: ANIMATION_CONSTANTS.heightZero,
      opacity: ANIMATION_CONSTANTS.opacityOut,
      duration: ANIMATION_CONSTANTS.collapse.duration,
      ease: ANIMATION_CONSTANTS.collapse.ease,
    });
  }

  private formatKeyToLabel(key: string): string {
    if (!key) return '';
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  private showMessage(
    msg: string,
    type: 'success' | 'warning' | 'danger' | 'info'
  ): void {
    this.message = msg;
    this.messageType = type;
  }

  private handleApiError(
    error: HttpErrorResponse,
    context: 'dropdown' | 'search' | 'add'
  ): void {
    this.isLoading = false;

    if (context !== 'search') {
      this.pagedPolicyData = [];
      this.totalRecords = 0;
    }

    if (!navigator.onLine) {
      this.showMessage(MESSAGES.ERROR.OFFLINE, 'danger');
    } else if (error.status === 401 || error.status === 403) {
      this.showMessage(MESSAGES.ERROR.UNAUTHORIZED, 'danger');
    } else if (context === 'dropdown') {
      this.showMessage(MESSAGES.ERROR.DROPDOWN_LOAD, 'danger');
    } else if (context === 'search') {
      this.showMessage(MESSAGES.ERROR.SEARCH, 'danger');
    } else if (context === 'add') {
      this.showMessage(MESSAGES.ERROR.ADD_POLICY, 'danger');
    } else {
      this.showMessage(MESSAGES.ERROR.UNKNOWN, 'danger');
    }
    this.cdr.detectChanges();
  }

  private initializeNewPolicy(): void {
    this.newPolicy = {
      jurisdiction: '',
      businessArea: '',
      inventoryType: '',
      entityType: '',
      description: '',
      retentionPeriod: '',
      effectiveDate: '',
      policyParameter: '',
      mediaStorageType: '',
      expirationDate: '',
      status: '',
    };
  }

  private playInitialAnimations(): void {
    if (this.section1 && this.section2 && this.section3) {
      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONSTANTS.ease,
          duration: ANIMATION_CONSTANTS.duration,
        },
      });

      tl.from(
        this.section1.nativeElement,
        {
          y: ANIMATION_CONSTANTS.yDown,
          opacity: ANIMATION_CONSTANTS.opacityOut,
        },
        0
      )
        .from(
          this.section2.nativeElement,
          {
            scaleX: ANIMATION_CONSTANTS.scaleX,
            opacity: ANIMATION_CONSTANTS.opacityOut,
          },
          0
        )
        .from(
          this.section3.nativeElement,
          {
            y: ANIMATION_CONSTANTS.yUp,
            opacity: ANIMATION_CONSTANTS.opacityOut,
          },
          0
        );
    }
  }

  private playSearchFormAnimation(): void {
    if (this.section1) {
      gsap.from(this.section1.nativeElement, {
        y: ANIMATION_CONSTANTS.yDown,
        opacity: ANIMATION_CONSTANTS.opacityOut,
        ease: ANIMATION_CONSTANTS.ease,
        duration: ANIMATION_CONSTANTS.duration,
      });
    }
  }

  private playAddFormAnimation(): void {
    if (this.addSection) {
      gsap.from(this.addSection.nativeElement, {
        y: ANIMATION_CONSTANTS.yDown,
        opacity: ANIMATION_CONSTANTS.opacityOut,
        ease: ANIMATION_CONSTANTS.ease,
        duration: ANIMATION_CONSTANTS.duration,
      });
    }
  }

  private playHideAddFormAnimation(onComplete: () => void): void {
    if (!this.addSection?.nativeElement) {
      onComplete();
      return;
    }

    gsap.to(this.addSection.nativeElement, {
      y: ANIMATION_CONSTANTS.yDown,
      opacity: ANIMATION_CONSTANTS.opacityOut,
      ease: ANIMATION_CONSTANTS.hide.ease,
      duration: ANIMATION_CONSTANTS.hide.duration,
      onComplete: onComplete,
    });
  }

  private animateContainerToAutoHeight(): void {
    if (this.collapsibleContent?.nativeElement) {
      gsap.to(this.collapsibleContent.nativeElement, {
        height: ANIMATION_CONSTANTS.heightAuto,
        opacity: ANIMATION_CONSTANTS.opacityIn,
        duration: ANIMATION_CONSTANTS.collapse.duration,
        ease: ANIMATION_CONSTANTS.collapse.ease,
      });
    }
  }
}
