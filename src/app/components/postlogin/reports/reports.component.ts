import { Component } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  isCardFlipped = false;

  flipCard() {
    this.isCardFlipped = !this.isCardFlipped;
  }
}
