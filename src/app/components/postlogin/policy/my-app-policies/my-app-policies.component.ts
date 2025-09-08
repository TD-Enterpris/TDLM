import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
import {
  ComplexTableComponent,
  ColumnConfig,
  TableRow,
  SortDirection,
} from '../../../shared/complex-table/complex-table.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { TemporalMessageComponent } from '../../../shared/temporal-message/temporal-message.component';
import {
  ANIMATION_CONSTANTS,
  COLUMN_CONFIG,
  DEFAULT_VISIBLE_COLUMNS,
  ID_PROPERTY,
  INITIAL_PAGE_SIZE,
  INITIAL_SORT_STATE,
  MESSAGES,
  ERROR_MESSAGES,
  ErrorKey,
} from './my-app-policies.constants';
import { MyAppPoliciesService, Policy } from '../../../../services/api/my-app-policies.service';

@Component({
  selector: 'app-my-app-policies',
  standalone: true,
  imports: [
    CommonModule,
    ComplexTableComponent,
    PaginationComponent,
    SpinnerComponent,
    TemporalMessageComponent,
  ],
  templateUrl: './my-app-policies.component.html',
  styleUrl: './my-app-policies.component.css',
})
export class MyAppPoliciesComponent implements OnInit, OnDestroy {
  @ViewChild('tableSection') tableSection!: ElementRef;
  @ViewChild('paginationSection') paginationSection!: ElementRef;

  private subscriptions = new Subscription();
  public isInitialLoad = true;
  public isAnimatedVisible = false;
  public isLoading = true;
  public pagedPolicies: Policy[] = [];
  public idProperty = ID_PROPERTY;
  public columnConfig: Record<string, ColumnConfig> | undefined;
  public defaultVisibleColumns: string[] = DEFAULT_VISIBLE_COLUMNS;
  public totalRecords = 0;
  public pageSize = INITIAL_PAGE_SIZE;
  public currentPageNumber = 0;
  public sortState = { ...INITIAL_SORT_STATE };
  public message = '';
  public messageType: 'success' | 'danger' | 'warning' = 'success';

  constructor(
    private router: Router,
    private policiesService: MyAppPoliciesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeColumnConfig();
    this.loadPolicies();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

private initializeColumnConfig(): void {
    this.columnConfig = {
      ...COLUMN_CONFIG,
      status: {
        ...COLUMN_CONFIG['status'],
        type: 'chip',
        classFn: (row: TableRow) => {
          // Get the status and convert it to lowercase for case-insensitive matching
          const status = String(row['status'] || '').toLowerCase();
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
      actions: {
        type: 'buttons',
        label: 'Actions',
        buttons: (row: TableRow) => [
          { action: 'view', label: 'View Policy', spanIcon: 'td-icon-18x18 td-icon-18x18-showPassword', title: 'View policy details' },
        ],
      },
    };
  }

  public loadPolicies(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    const params = {
      page: this.currentPageNumber,
      size: this.pageSize,
      sortBy: this.sortState.column,
      direction: this.sortState.direction,
    };
    const sub = this.policiesService.getPolicies(params).subscribe({
      next: (response) => {
        try {
          this.pagedPolicies = response.data.content;
          this.totalRecords = response.data.totalElements;
          this.isLoading = false;

          // Removed page load success messages. Only show a warning if no policies are found.
          if (this.totalRecords === 0) {
            const msg = ERROR_MESSAGES[ErrorKey.NO_POLICIES];
            this.showMessage(typeof msg === 'function' ? msg() : msg, 'warning');
          }

          if (this.isInitialLoad) {
            this.isAnimatedVisible = false;
            this.cdr.detectChanges();
            this.playInitialAnimations();
            this.isInitialLoad = false;
          } else {
            this.isAnimatedVisible = true;
          }
        } catch {
          this.isLoading = false;
          this.isAnimatedVisible = true;
          const msg = ERROR_MESSAGES[ErrorKey.LOAD];
          this.showMessage(typeof msg === 'function' ? msg() : msg, 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.isAnimatedVisible = true;
        let backendMsg = error?.error?.message;
        if (backendMsg) {
          this.showMessage(backendMsg, 'danger');
          return;
        }
        // Industry-standard error handling
        let uiMsg = '';
        const getMsg = (key: ErrorKey, code?: number) => {
          const val = ERROR_MESSAGES[key];
          return typeof val === 'function' ? val(code) : val;
        };
        switch (error?.status) {
          case 0:
            uiMsg = getMsg(ErrorKey.NETWORK);
            break;
          case 400:
            uiMsg = getMsg(ErrorKey.BAD_REQUEST);
            break;
          case 401:
            uiMsg = getMsg(ErrorKey.AUTH);
            break;
          case 403:
            uiMsg = getMsg(ErrorKey.FORBIDDEN);
            break;
          case 404:
            uiMsg = getMsg(ErrorKey.NOT_FOUND);
            break;
          case 408:
            uiMsg = getMsg(ErrorKey.TIMEOUT);
            break;
          case 409:
            uiMsg = getMsg(ErrorKey.CONFLICT);
            break;
          case 413:
            uiMsg = getMsg(ErrorKey.PAYLOAD_TOO_LARGE);
            break;
          case 415:
            uiMsg = getMsg(ErrorKey.UNSUPPORTED_MEDIA_TYPE);
            break;
          case 429:
            uiMsg = getMsg(ErrorKey.TOO_MANY_REQUESTS);
            break;
          case 500:
            uiMsg = getMsg(ErrorKey.INTERNAL_SERVER);
            break;
          case 502:
            uiMsg = getMsg(ErrorKey.BAD_GATEWAY);
            break;
          case 503:
            uiMsg = getMsg(ErrorKey.SERVICE_UNAVAILABLE);
            break;
          case 504:
            uiMsg = getMsg(ErrorKey.GATEWAY_TIMEOUT);
            break;
          default:
            if (error?.status) {
              uiMsg = getMsg(ErrorKey.GENERIC, error?.status);
            } else {
              uiMsg = getMsg(ErrorKey.LOAD);
            }
        }
        this.showMessage(uiMsg, 'danger');
      },
    });
    this.subscriptions.add(sub);
  }

  public onPageChange(page: number): void {
    this.currentPageNumber = page;
    this.loadPolicies();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPageNumber = 0;
    this.loadPolicies();
  }

  public onSortChanged(sort: { column: string; direction: SortDirection }): void {
    this.sortState = sort;
    this.currentPageNumber = 0;
    this.loadPolicies();
  }

  public onTableAction(event: { action: string; row: TableRow }): void {
    if (event.action === 'view') {
      this.onViewPolicy(event.row[this.idProperty] as string);
    }
  }

  private onViewPolicy(policyId: string): void {
    this.router.navigate(['/view-policy', policyId]).catch(() => {
      const msg = ERROR_MESSAGES[ErrorKey.NAVIGATION_FAIL];
      this.showMessage(typeof msg === 'function' ? msg() : msg, 'danger');
    });
  }



  private showMessage(msg: string, type: 'success' | 'danger' | 'warning'): void {
    this.message = msg;
    this.messageType = type;
  }

  private playInitialAnimations(): void {
    if (this.tableSection && this.paginationSection) {
      const container = this.tableSection.nativeElement.closest('.content-to-animate');
      gsap.set(container, { opacity: 0, visibility: 'hidden' });
      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONSTANTS.ease,
          duration: ANIMATION_CONSTANTS.duration,
        },
      });
      tl.set(container, { visibility: 'visible' }, 0)
        .to(container, { opacity: 1 }, 0)
        .from(this.tableSection.nativeElement, { y: -50, opacity: 0 }, 0)
        .from(this.paginationSection.nativeElement, { y: 50, opacity: 0 }, 0);
      this.isAnimatedVisible = true;
    }
  }
}
