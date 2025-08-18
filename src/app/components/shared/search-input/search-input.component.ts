import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Enter a value';
  @Input() label: string = 'Enter Account Number/VIN';
  @Input() id: string = 'exampleText1';
  @Input() errorMessage: string = '';
  @Input() customClass: string | string[] = '';
  @Input() title: string = '';

  @Input() modelValue: string = '';
  @Output() modelValueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  get ariaLabel(): string {
    return this.label?.trim() || this.placeholder?.trim() || 'Search input';
  }

  get computedTitle(): string {
    return this.title?.trim() || this.ariaLabel;
  }

  onInputChange(event: Event): void {
    const input = event?.target as HTMLInputElement;
    if (input?.value !== undefined) {
      this.modelValue = input.value;
      this.modelValueChange.emit(this.modelValue);
    }
  }

  onSearch(): void {
    this.search.emit();
  }

  onClear(): void {
    this.modelValue = '';
    this.modelValueChange.emit(this.modelValue);
    this.clear.emit();
  }
}