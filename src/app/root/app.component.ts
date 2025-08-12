import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/core/header/header.component';
import { FooterComponent } from '../components/core/footer/footer.component';
import gsap from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'TMU';

  @ViewChild('routeContainer') routeContainer!: ElementRef;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        gsap.to(this.routeContainer.nativeElement, {
          opacity: 0,
          duration: 0.2,
          ease: 'power1.inOut'
        });
      }

      if (event instanceof NavigationEnd) {
        gsap.fromTo(
          this.routeContainer.nativeElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power1.out' }
        );
      }
    });
  }
}
