import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],
})
export class ToggleComponent {
  @Input() label: string = 'Toggle';
  @Input() checked: boolean = false;
  @Input() toggleId: string = 'toggle-id';
  @Input() isDisabled: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  onToggleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
