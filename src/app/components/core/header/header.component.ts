import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  OnDestroy,
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';
import gsap from 'gsap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  isMenuOpen = false;
  isMenuVisible = false;
  isOverlayVisible = false;

  isPolicyOpen = false;
  isLoginMenuOpen = false;

  private focusTrapHandler: ((event: KeyboardEvent) => void) | null = null;

  @ViewChild('headerWrapper', { static: false }) headerWrapper!: ElementRef;
  @ViewChild('mobileMenuContent', { static: false }) mobileMenuContent!: ElementRef;
  @ViewChild('menuToggleBtn', { static: false }) menuToggleBtn!: ElementRef;

  @ViewChild('policyDropdownContainer') policyDropdownContainer!: ElementRef;
  @ViewChild('loginDropdownContainer') loginDropdownContainer!: ElementRef;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
        this.closeDropdowns();
      });
  }

  ngAfterViewInit(): void {
    gsap.fromTo(
      this.headerWrapper.nativeElement,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          this.headerWrapper.nativeElement.style.transform = 'none';
        },
      }
    );

    this.setupFocusTrap();
  }

  ngOnDestroy(): void {
    const menu = this.mobileMenuContent?.nativeElement;
    if (menu && this.focusTrapHandler) {
      menu.removeEventListener('keydown', this.focusTrapHandler);
    }
  }

  onDropdownFocusOut(event: FocusEvent, menu: string): void {
    setTimeout(() => {
      let container: HTMLElement;
      switch (menu) {
        case 'policy':
          container = this.policyDropdownContainer.nativeElement;
          if (!container.contains(document.activeElement)) {
            this.isPolicyOpen = false;
          }
          break;
        case 'login':
          container = this.loginDropdownContainer.nativeElement;
          if (!container.contains(document.activeElement)) {
            this.isLoginMenuOpen = false;
          }
          break;
      }
    }, 0);
  }

  toggleMenu(): void {
    if (!this.isMenuOpen) {
      this.isMenuVisible = true;
      this.isOverlayVisible = true;
      setTimeout(() => {
        this.isMenuOpen = true;
        setTimeout(() => {
          const menu = this.mobileMenuContent?.nativeElement as HTMLElement;
          const firstFocusable = menu?.querySelector<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }, 50);
      }, 0);
    } else {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    setTimeout(() => (this.isMenuVisible = false), 400);
    setTimeout(() => (this.isOverlayVisible = false), 450);

    setTimeout(() => {
      this.menuToggleBtn?.nativeElement?.focus();
    }, 500);
  }

  togglePolicy(): void {
    this.isLoginMenuOpen = false;
    this.isPolicyOpen = !this.isPolicyOpen;
  }

  toggleLoginMenu(): void {
    this.isPolicyOpen = false;
    this.isLoginMenuOpen = !this.isLoginMenuOpen;
  }

  onDropdownKeydown(event: KeyboardEvent, menu: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (menu === 'policy') this.togglePolicy();
      if (menu === 'login') this.toggleLoginMenu();
    }
  }

  onAccordionKeydown(event: KeyboardEvent, type: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (type === 'policy') this.togglePolicy();
    }
  }

  setupFocusTrap(): void {
    const menu = this.mobileMenuContent?.nativeElement;
    if (!menu) return;

    this.focusTrapHandler = (event: KeyboardEvent) => {
      const isTab = event.key === 'Tab';
      const isEscape = event.key === 'Escape';

      if (!isTab && !isEscape) return;

      const focusableEls = Array.from(
        menu.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => (el as HTMLElement).offsetParent !== null
      ) as HTMLElement[];

      if (!focusableEls.length) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (isEscape) {
        event.preventDefault();
        this.closeMenu();
        return;
      }

      if (isTab) {
        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };

    menu.addEventListener('keydown', this.focusTrapHandler);
  }

  skipToMain(): void {
    const mainElement = this.document.getElementById('main');
    if (mainElement) {
      mainElement.focus();
      mainElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  closeDropdowns(): void {
    this.isPolicyOpen = false;
    this.isLoginMenuOpen = false;
  }
}
