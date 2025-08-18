import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-input-legacy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-legacy.component.html',
  styleUrls: ['./input-legacy.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputLegacyComponent),
      multi: true,
    },
  ],
})
export class InputLegacyComponent implements ControlValueAccessor, AfterViewInit {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: string = 'text';
  @Input() maxLength = 255;
  @Input() inputMode: string = 'text';
  @Input() error: string = '';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() inputClass: string = '';
  @Input() autofocus: boolean = false;

  @ViewChild('editableInput') inputElementRef!: ElementRef;

  private _model: string = '';
  @Input()
  get model(): string {
    return this._model;
  }
  set model(val: string) {
    this._model = val;
    this.onChange(val);
    this.modelChange.emit(val);
  }

  @Output() modelChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() keypress = new EventEmitter<KeyboardEvent>();

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    if (this.autofocus && this.inputElementRef?.nativeElement) {
      setTimeout(() => {
        this.inputElementRef.nativeElement.focus();
      }, 0);
    }
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this._model = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.model = value;
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onKeyPress(event: KeyboardEvent): void {
    this.keypress.emit(event);
  }
}