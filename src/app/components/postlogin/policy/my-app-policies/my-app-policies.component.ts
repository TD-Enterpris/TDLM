import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
  private isInitialLoad = true;

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
  public messageType: 'success' | 'danger' = 'success';

  constructor(
    private router: Router,
    private policiesService: MyAppPoliciesService
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
      actions: {
        type: 'buttons',
        label: 'Actions',
        buttons: (row: TableRow) => [
          { action: 'view', label: 'View', title: 'View policy details' },
        ],
      },
    };
  }

  public loadPolicies(): void {
    this.isLoading = true;
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

          if (this.isInitialLoad) {
            setTimeout(() => this.playInitialAnimations(), 50);
            this.isInitialLoad = false;
          }
        } catch {
          this.isLoading = false;
          this.showMessage(MESSAGES.ERROR.LOAD, 'danger');
        }
      },
      error: () => {
        this.isLoading = false;
        this.showMessage(MESSAGES.ERROR.LOAD, 'danger');
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
    this.router.navigate(['/view-policy', policyId]);
  }

  private showMessage(msg: string, type: 'success' | 'danger'): void {
    this.message = msg;
    this.messageType = type;
  }

  private playInitialAnimations(): void {
    if (this.tableSection && this.paginationSection) {
      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONSTANTS.ease,
          duration: ANIMATION_CONSTANTS.duration,
        },
      });
      tl.from(this.tableSection.nativeElement, { y: -50, opacity: 0 }, 0)
        .from(this.paginationSection.nativeElement, { y: 50, opacity: 0 }, 0);
    }
  }
}
