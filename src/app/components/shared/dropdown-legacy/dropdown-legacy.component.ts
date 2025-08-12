import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown-legacy',
  standalone: true,
  templateUrl: './dropdown-legacy.component.html',
  styleUrl: './dropdown-legacy.component.css',
  imports: [CommonModule, FormsModule],
})
export class DropdownLegacyComponent {
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder = 'Select a value';
  @Input() label = 'Search by Account Number/VIN';
  @Input() id = 'dropdown1';
  @Input() errorMessage = '';
  @Input() customClass: string | string[] = '';
  @Input() selectedValue = '';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false; // ✅ Added support for disabled

  @Output() selectedValueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  isActive = false;

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value || '';
    this.selectedValue = value;
    if (this.errorMessage && value) this.errorMessage = '';
    this.selectedValueChange.emit(value);
  }

  handleKeydown(e: KeyboardEvent) {
    if (['Space', 'Enter'].includes(e.code)) {
      this.isActive = true;
    }
  }

  setActive() {
    this.isActive = true;
  }

  removeActive() {
    this.isActive = false;
    this.blur.emit();
  }
}
