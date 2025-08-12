import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  imports: [CommonModule]
})
export class ButtonComponent {
  @Input() buttonLabel: string = 'Button';
  @Input() buttonClass: string | string[] = 'btn td-btn-primary-light w-100';
  @Input() showIcon: boolean = false;
  @Input() iconClass: string | string[] = 'td-icon td-icon-filter';
  @Input() disabled: boolean = false;

  @Input() ariaLabel: string = '';
  @Input() title: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}
