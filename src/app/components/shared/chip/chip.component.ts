import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css'],
})
export class ChipComponent {
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() outline: boolean = false;
  @Input() customClass: string = '';
}
