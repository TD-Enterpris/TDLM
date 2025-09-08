import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { gsap } from 'gsap';

import {
  ComplexTableComponent,
  ColumnConfig,
  TableRow
} from '../../../shared/complex-table/complex-table.component';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { ViewPolicyService, PolicyDetails, Approver } from '../../../../services/api/view-policy.service';
import {
  ANIMATION_CONSTANTS,
  APPROVERS_COLUMN_CONFIG,
  APPROVERS_DEFAULT_VISIBLE_COLUMNS,
  createAccordionData,
  INFO_COLUMN_CONFIG,
  INFO_DEFAULT_VISIBLE_COLUMNS,
  VIEW_POLICY_TEXT,
  TEMPORAL_MESSAGE_DURATION
} from './view-policy.constants';
import { CardComponent } from '../../../shared/card/card.component';
import { DateComponent } from '../../../shared/date/date.component';
import { TemporalMessageComponent } from '../../../shared/temporal-message/temporal-message.component';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-view-policy',
  standalone: true,
  imports: [
    CommonModule,
    ComplexTableComponent,
    SpinnerComponent,
    CardComponent,
    DateComponent,
    TemporalMessageComponent,
    DialogComponent
  ],
  templateUrl: './view-policy.component.html',
  styleUrls: ['./view-policy.component.css']
})
export class ViewPolicyComponent implements OnInit, AfterViewChecked, AfterViewInit {
  public VIEW_POLICY_TEXT = VIEW_POLICY_TEXT;
  public TEMPORAL_MESSAGE_DURATION = TEMPORAL_MESSAGE_DURATION;

  public saveMessageType: 'success' | 'danger' = 'success';
  public saveMessage = '';
  public showTemporalMessage = false;

  @ViewChild('summaryTable') summaryTable!: ElementRef;
  @ViewChild('detailsSectionLeft') detailsSectionLeft!: ElementRef;
  @ViewChild('detailsSectionRight') detailsSectionRight!: ElementRef;
  @ViewChild('approversTable') approversTable!: ElementRef;
  @ViewChild('datePickerContainer') datePickerContainer!: ElementRef;
  @ViewChild('confirmationDialog', { read: ElementRef }) confirmationDialogElementRef!: ElementRef;
  @ViewChild('confirmationDialog') confirmationDialog!: DialogComponent;

  public policyId: string | null = null;
  public currentPolicy: PolicyDetails | null = null;
  public isLoading = true;
  public isModalLoading = false;
  public isEditingExpirationDate = false;

  public infoData: PolicyDetails[] = [];
  public policyDetailsData: ReturnType<typeof createAccordionData> = [];
  public policyApprovers: Approver[] = [];
  public expirationDate = '';
  public originalExpirationDate = '';

  public infoColumnConfig: Record<string, ColumnConfig> = INFO_COLUMN_CONFIG;
  public approversColumnConfig: Record<string, ColumnConfig> = APPROVERS_COLUMN_CONFIG;
  public infoDefaultVisibleColumns = INFO_DEFAULT_VISIBLE_COLUMNS;
  public approversDefaultVisibleColumns = APPROVERS_DEFAULT_VISIBLE_COLUMNS;

  confirmationDialogTitle = VIEW_POLICY_TEXT.confirmSaveTitle;
  confirmationDialogMessage = VIEW_POLICY_TEXT.confirmSaveMessage;
  private pendingSave = false;

  public showActionsColumn = true; // New property to control visibility

  get visibleInfoColumns(): string[] {
    return this.showActionsColumn
      ? this.infoDefaultVisibleColumns
      : this.infoDefaultVisibleColumns.filter(col => col !== 'actions');
  }

  constructor(
    private route: ActivatedRoute,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private viewPolicyService: ViewPolicyService
  ) {}

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {
    if (this.isEditingExpirationDate && this.datePickerContainer && !this.datePickerContainer.nativeElement.classList.contains('animated')) {
      this.animateDatePickerIn();
    }
  }

  openSaveConfirmDialog(): void {
    this.confirmationDialogTitle = VIEW_POLICY_TEXT.confirmSaveTitle;
    this.confirmationDialogMessage = VIEW_POLICY_TEXT.confirmSaveMessage;
    this.pendingSave = true;
    this.confirmationDialog.open();
    setTimeout(() => {
      this.animateModalIn();
    }, 0);
  }

  onSaveConfirmYes(): void {
    this.isModalLoading = true;
    this.onSave();
  }

  onSaveConfirmNo(): void {
    this.animateModalOut(() => {
      this.confirmationDialog.close();
      this.isModalLoading = false;
      this.pendingSave = false;
    });
  }

  ngOnInit(): void {
    this.policyId = this.route.snapshot.paramMap.get('id');
    if (this.policyId) {
      this.loadPolicyDetails(this.policyId);
    } else {
      this.isLoading = false;
    }
  }

  loadPolicyDetails(id: string): void {
    this.isLoading = true;
    this.viewPolicyService.getPolicyById(id).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.currentPolicy = response.data;
          this.policyApprovers = Array.isArray(this.currentPolicy.approvers) ? [...this.currentPolicy.approvers] : [];
          this.expirationDate = this.currentPolicy.expirationDate;
          this.originalExpirationDate = this.currentPolicy.expirationDate;
          this.infoData = [this.currentPolicy];
          this.isLoading = false;
          this.setupAccordionData();
          setTimeout(() => this.playEntranceAnimation());
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  setupAccordionData(): void {
    if (this.currentPolicy) {
          this.policyDetailsData = createAccordionData(this.currentPolicy);
    }
  }

  private playEntranceAnimation(): void {
    if (
      this.summaryTable?.nativeElement &&
      this.detailsSectionLeft?.nativeElement &&
      this.detailsSectionRight?.nativeElement &&
      this.approversTable?.nativeElement
    ) {
      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONSTANTS.ease,
          duration: ANIMATION_CONSTANTS.duration,
        },
      });

      // Section 1 - Policy details slides down
      tl.from(this.summaryTable.nativeElement, { y: ANIMATION_CONSTANTS.yDown, opacity: ANIMATION_CONSTANTS.opacityOut }, 0);

      // Section 2 - cards slide from left and right
      tl.from(this.detailsSectionLeft.nativeElement, { x: -50, opacity: ANIMATION_CONSTANTS.opacityOut }, 0.2);
      tl.from(this.detailsSectionRight.nativeElement, { x: 50, opacity: ANIMATION_CONSTANTS.opacityOut }, 0.2);

      // Section 3 approvers slides up
      tl.from(this.approversTable.nativeElement, { y: ANIMATION_CONSTANTS.yUp, opacity: ANIMATION_CONSTANTS.opacityOut }, 0.4);
    }
  }

  public onTableAction(event: { action: string; row: TableRow }): void {
    if (event.action === 'edit') {
      this.isEditingExpirationDate = true;
      this.showActionsColumn = false; // Hide actions column on edit
      this.cdr.detectChanges();
    }
  }

  onDateChange(event: { date: string }): void {
    this.expirationDate = event.date;
  }

  onSave(): void {
    if (!this.policyId) {
      this.onSaveComplete();
      return;
    }

    if (!this.isDateChanged()) {
      this.onSaveComplete();
      return;
    }

    this.isModalLoading = true;
    this.viewPolicyService.updateExpirationDate(this.policyId, this.expirationDate).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.saveMessageType = 'success';
          this.saveMessage = VIEW_POLICY_TEXT.temporalSuccess;
          this.showTemporalMessage = true;
          this.originalExpirationDate = this.expirationDate;
          this.currentPolicy = response.data;
          this.setupAccordionData();
        } else {
          this.saveMessageType = 'danger';
          this.saveMessage = response.message || VIEW_POLICY_TEXT.temporalError;
          this.showTemporalMessage = true;
        }
        this.onSaveComplete();
      },
      error: (error) => {
        this.saveMessageType = 'danger';
        this.saveMessage = error?.error?.message || VIEW_POLICY_TEXT.temporalErrorGeneric;
        this.showTemporalMessage = true;
        this.onSaveComplete();
      }
    });
  }

  private onSaveComplete(): void {
    this.animateModalOut(() => {
      this.confirmationDialog.close();
      this.isModalLoading = false;
      this.showActionsColumn = true; // Show actions column after save
      this.animateDatePickerOut(() => {
        this.isEditingExpirationDate = false;
        this.cdr.detectChanges();
      });
    });
  }

  onCancel(): void {
    this.expirationDate = this.originalExpirationDate;
    this.showActionsColumn = true; // Show actions column on cancel
    this.animateDatePickerOut(() => {
      this.isEditingExpirationDate = false;
    });
  }

  isDateChanged(): boolean {
    return this.expirationDate !== this.originalExpirationDate;
  }

  goBack(): void {
    this.location.back();
  }

  reload(): void {
    if (this.policyId) {
      this.loadPolicyDetails(this.policyId);
    }
  }

  private animateDatePickerIn(): void {
    if (this.datePickerContainer?.nativeElement) {
      gsap.set(this.datePickerContainer.nativeElement, { y: 20, opacity: 0 });
      gsap.to(this.datePickerContainer.nativeElement, { y: 0, opacity: 1, duration: 0.5 });
      this.datePickerContainer.nativeElement.classList.add('animated');
    }
  }

  private animateDatePickerOut(onComplete: () => void): void {
    if (this.datePickerContainer?.nativeElement) {
      gsap.to(this.datePickerContainer.nativeElement, {
        y: 20,
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          this.datePickerContainer.nativeElement.classList.remove('animated');
          onComplete();
        }
      });
    } else {
      onComplete();
    }
  }

  private animateModalIn(): void {
    const dialogElement = this.confirmationDialogElementRef?.nativeElement?.querySelector('.modal-content');
    if (dialogElement) {
      gsap.fromTo(dialogElement,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }

  private animateModalOut(onComplete: () => void): void {
    const dialogElement = this.confirmationDialogElementRef?.nativeElement?.querySelector('.modal-content');
    if (dialogElement) {
      gsap.to(dialogElement,
        { y: 20, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onComplete }
      );
    } else {
      onComplete();
    }
  }
}
