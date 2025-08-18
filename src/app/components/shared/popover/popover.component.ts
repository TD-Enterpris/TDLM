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

  public show(triggerElement: HTMLElement): void {
    this.dispose();

    if (triggerElement && this.popoverContentTemplate && typeof bootstrap !== 'undefined' && bootstrap.Popover) {
      this.bsPopoverInstance = new bootstrap.Popover(triggerElement, {
        html: true,
        content: this.popoverContentTemplate.nativeElement.innerHTML,
        placement: this.placement,
        trigger: 'manual',
        container: 'body'
      });
      this.bsPopoverInstance.show();
    }
  }

  public hide(): void {
    if (this.bsPopoverInstance) {
      this.bsPopoverInstance.hide();
    }
  }

  public dispose(): void {
    if (this.bsPopoverInstance) {
      this.bsPopoverInstance.dispose();
      this.bsPopoverInstance = null;
    }
  }

  onCloseClick(): void {
    this.hide();
  }
}