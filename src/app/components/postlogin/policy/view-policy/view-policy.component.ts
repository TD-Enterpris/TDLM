import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
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
} from './view-policy.constants';
import { CardComponent } from '../../../shared/card/card.component';

@Component({
  selector: 'app-view-policy',
  standalone: true,
  imports: [
    CommonModule,
    ComplexTableComponent,
    SpinnerComponent,
    CardComponent
  ],
  templateUrl: './view-policy.component.html',
  styleUrls: ['./view-policy.component.css']
})
export class ViewPolicyComponent implements OnInit {

  @ViewChild('summaryTable') summaryTable!: ElementRef;
  @ViewChild('accordionSection') accordionSection!: ElementRef;

  public policyId: string | null = null;
  public currentPolicy: PolicyDetails | null = null;
  public isLoading = true;

  public infoData: any[] = [];
  public policyAccordionData: any[][] = [];
  public policyApprovers: Approver[] = [];

  public infoColumnConfig: Record<string, ColumnConfig> | undefined;
  public approversColumnConfig: Record<string, ColumnConfig> | undefined;
  public infoDefaultVisibleColumns: string[] = INFO_DEFAULT_VISIBLE_COLUMNS;
  public approversDefaultVisibleColumns: string[] = APPROVERS_DEFAULT_VISIBLE_COLUMNS;

  constructor(
    private route: ActivatedRoute,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private viewPolicyService: ViewPolicyService
  ) {}

  ngOnInit(): void {
    this.policyId = this.route.snapshot.paramMap.get('id');
    this.infoColumnConfig = INFO_COLUMN_CONFIG;
    this.approversColumnConfig = APPROVERS_COLUMN_CONFIG;

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
          this.policyApprovers = [...this.currentPolicy.approvers];

          this.infoData = [this.currentPolicy];

          this.isLoading = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.setupAccordionData();
            this.cdr.detectChanges();
            this.playEntranceAnimation();
            this.initializeButtonAnimations();
          }, 0);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setupAccordionData(): void {
    if(this.currentPolicy) {
      this.policyAccordionData = createAccordionData(this.currentPolicy);
    }
  }

  private playEntranceAnimation(): void {
    if (this.summaryTable && this.accordionSection) {
      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONSTANTS.ease,
          duration: ANIMATION_CONSTANTS.duration,
        },
      });

      tl.from(this.summaryTable.nativeElement, { y: ANIMATION_CONSTANTS.yDown, opacity: ANIMATION_CONSTANTS.opacityOut }, 0)
        .from(this.accordionSection.nativeElement, { y: ANIMATION_CONSTANTS.yUp, opacity: ANIMATION_CONSTANTS.opacityOut }, 0);
    }
  }

  initializeButtonAnimations(): void {
    const buttons = this.el.nativeElement.querySelectorAll('tbody .td-btn-tertiary');
    buttons.forEach((button: HTMLElement) => {
      const textSpan = button.querySelector('span:last-of-type');
      if (!textSpan) return;
      gsap.set(textSpan, { opacity: 0, x: -10, visibility: 'hidden' });
      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(textSpan, { opacity: 1, x: 0, visibility: 'visible', duration: 0.3, ease: 'power2.inOut' })
        .to(button, { scale: 1.05, duration: 0.3, ease: 'power2.inOut' }, 0);
      (button as any).animation = timeline;
      button.addEventListener('mouseenter', () => (button as any).animation.play());
      button.addEventListener('mouseleave', () => (button as any).animation.reverse());
    });
  }

  public onTableAction(event: { action: string; row: TableRow }): void {
  }

  goBack(): void {
    this.location.back();
  }

  reload(): void {
  if (this.policyId) {
    this.loadPolicyDetails(this.policyId);
  }
}
}