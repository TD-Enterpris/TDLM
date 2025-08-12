// src/app/popover/popover.component.ts

import { Component, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css']
})
export class PopoverComponent implements OnDestroy {

  @Input() showCloseButton: boolean = true;
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'bottom';

  @ViewChild('popoverContentTemplate') popoverContentTemplate!: ElementRef;

  private bsPopoverInstance: any;

  ngOnDestroy(): void {
    this.dispose();
  }

  /**
   * Initializes and shows the popover on a specified trigger element.
   * The content is projected via <ng-content> from the parent.
   * @param triggerElement The DOM element that will trigger the popover.
   */
  public show(triggerElement: HTMLElement): void {
    this.dispose(); // Ensure any old instance is removed

    if (triggerElement && this.popoverContentTemplate && typeof bootstrap !== 'undefined' && bootstrap.Popover) {
      this.bsPopoverInstance = new bootstrap.Popover(triggerElement, {
        html: true,
        content: this.popoverContentTemplate.nativeElement.innerHTML,
        placement: this.placement,
        trigger: 'manual', // We will show and hide it manually
        container: 'body'
      });
      this.bsPopoverInstance.show();
    }
  }

  /**
   * Hides the currently active popover.
   */
  public hide(): void {
    if (this.bsPopoverInstance) {
      this.bsPopoverInstance.hide();
    }
  }

  /**
   * Hides and completely destroys the popover instance to prevent memory leaks.
   */
  public dispose(): void {
    if (this.bsPopoverInstance) {
      this.bsPopoverInstance.dispose();
      this.bsPopoverInstance = null;
    }
  }

  /**
   * NOTE: The original onCloseClick method will no longer work when this
   * component's HTML is copied. It's best to remove the close button
   * from the HTML and rely on mouseleave to hide the popover.
   */
  onCloseClick(): void {
    this.hide();
  }
}
