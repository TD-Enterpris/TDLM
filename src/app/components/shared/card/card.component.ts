import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
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
  @ViewChild('card', { static: true }) cardEl!: ElementRef;

  ngAfterViewInit() {
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
}