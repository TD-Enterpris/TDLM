import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

declare var bootstrap: any;

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements AfterViewInit {
  @Input() id: string = 'sharedModal';
  @Input() title: string = '';
  @Input() closeOnBackdrop: boolean = false;

  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalRef', { static: false }) modalRef!: ElementRef;

  private modalInstance: any;
  private isClosingWithAnimation = false;

  ngAfterViewInit(): void {
    const modalEl = this.modalRef.nativeElement;
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl, {
        backdrop: this.closeOnBackdrop ? true : 'static'
      });

      modalEl.addEventListener('show.bs.modal', () => {
        const dialog = modalEl.querySelector('.modal-dialog');
        gsap.set(dialog, { scale: 0.9, opacity: 0 });
      });

      modalEl.addEventListener('shown.bs.modal', () => {
        const dialog = modalEl.querySelector('.modal-dialog');
        gsap.to(dialog, { scale: 1, opacity: 1, duration: 0.45, ease: 'expo.out' });
      });

      modalEl.addEventListener('hide.bs.modal', (event: Event) => {
        if (!this.isClosingWithAnimation) {
          event.preventDefault();
          this.close();
        }
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        this.closed.emit();
      });
    }
  }

  open(): void {
    this.modalInstance?.show();
  }

  close(): void {
    if (this.isClosingWithAnimation) {
      return;
    }
    this.isClosingWithAnimation = true;

    const dialog = this.modalRef.nativeElement.querySelector('.modal-dialog');
    const backdrop = document.querySelector('.modal-backdrop');

    const tl = gsap.timeline({
      onComplete: () => {
        this.modalInstance?.hide();
        this.isClosingWithAnimation = false;
        if (backdrop) {
          // Remove the inline style so Bootstrap can control it next time
          (backdrop as HTMLElement).style.opacity = '';
        }
      }
    });

    tl.to(dialog, {
      scale: 0.9,
      opacity: 0,
      duration: 0.35,
      ease: 'expo.in'
    });

    if (backdrop) {
      tl.to(backdrop, {
        opacity: 0,
        duration: 0.35,
        ease: 'expo.in'
      }, "<"); // Starts at the same time as the previous animation
    }
  }
}
