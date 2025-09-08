import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements AfterViewInit {
  @Input() bodyClass: string = '';
  @Input() animate: boolean = false;
  @Input() isFlipped: boolean = false;
  @Output() isFlippedChange = new EventEmitter<boolean>();

  @ViewChild('card', { static: true }) cardEl!: ElementRef;
  @ViewChild('cardInner', { static: true }) cardInnerEl!: ElementRef;

  private tl!: gsap.core.Timeline;

  ngAfterViewInit() {
    this.setupHoverAnimation();
    this.setupFlipAnimation();
  }

  private setupHoverAnimation() {
    if (!this.animate) return;

    const card = this.cardEl.nativeElement;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(card.querySelector('.card-icon'), {
        scale: 0.9,
        opacity: 0.7,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });

      gsap.to(card.querySelector('.card-title'), {
        fontSize: '1.75rem',
        duration: 0.3,
        ease: 'power1.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power2.inOut',
      });

      gsap.to(card.querySelector('.card-icon'), {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });

      gsap.to(card.querySelector('.card-title'), {
        fontSize: '1.5rem',
        duration: 0.3,
        ease: 'power1.in',
      });
    });
  }

  private setupFlipAnimation() {
    // Set the transform origin to the center for a proper flip
    gsap.set(this.cardInnerEl.nativeElement, { transformOrigin: '50% 50%' });
    // Create a timeline for the flip animation, but keep it paused initially
    this.tl = gsap.timeline({ paused: true });
    this.tl.to(this.cardInnerEl.nativeElement, {
      duration: 0.3,
      rotationY: '+=180',
      ease: 'power2.inOut',
    });
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    this.isFlippedChange.emit(this.isFlipped);
    if (this.isFlipped) {
      this.tl.play();
    } else {
      this.tl.reverse();
    }
  }
}

