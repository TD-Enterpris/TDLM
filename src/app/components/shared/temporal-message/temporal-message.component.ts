import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-temporal-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temporal-message.component.html',
  styleUrls: ['./temporal-message.component.css'],
})
export class TemporalMessageComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() message: string = '';
  @Input() duration: number | null = null;
  @Input() type: 'success' | 'warning' | 'danger' | 'info' = 'success';
  @Input() showCloseButton: boolean = true;

  isVisible: boolean = true;
  private timeoutRef: any;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // This hook ensures the element from *ngIf is in the DOM
    if (this.el.nativeElement.firstElementChild) {
      gsap.fromTo(
        this.el.nativeElement.firstElementChild,
        { y: 30, opacity: 0 }, // Start from below
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.duration !== null && (changes['duration'] || changes['message'])) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = setTimeout(() => {
        this.close(); // Call the renamed method
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutRef);
  }

  // Renamed this method from hideMessage to close
  close(): void {
    if (this.el.nativeElement.firstElementChild) {
      gsap.to(this.el.nativeElement.firstElementChild, {
        opacity: 0,
        y: 30, // End below
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.isVisible = false;
          // Tell Angular to check for changes
          this.cdr.markForCheck();
        },
      });
    } else {
        // Fallback if animation target is already gone
        this.isVisible = false;
    }
  }
}
