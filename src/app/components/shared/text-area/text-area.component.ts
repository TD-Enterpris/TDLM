import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Add CommonModule here
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css'
})
export class TextAreaComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() title: string = '';
  @Input() textAreaId: string = 'textarea-' + Math.floor(Math.random() * 100000);

  @Output() valueChange = new EventEmitter<string>();

  onValueChange(newVal: string) {
    this.value = newVal;
    this.valueChange.emit(newVal);
  }

  getTitle(): string {
    return this.title?.trim() || this.label?.trim() || this.placeholder?.trim() || 'Text area input';
  }

  getAriaLabel(): string {
    return this.label?.trim() || this.title?.trim() || this.placeholder?.trim() || 'Text area input';
  }
}
