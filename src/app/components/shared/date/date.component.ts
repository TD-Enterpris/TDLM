import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

// THIS IS CLIENT CODE START, COMMENT/UNCOMMENT BASED ON YOUR NEED
// import { DatePickerComponent } from '@com-td-mplx/ibrary';
// THIS IS CLIENT CODE END

// THIS IS ANGULAR MATERIAL CODE START, COMMENT/UNCOMMENT BASED ON YOUR NEED
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
// THIS IS ANGULAR MATERIAL CODE END

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    // THIS IS CLIENT CODE START, COMMENT/UNCOMMENT BASED ON YOUR NEED
    // DatePickerComponent,
    // THIS IS CLIENT CODE END

    // THIS IS ANGULAR MATERIAL CODE START, COMMENT/UNCOMMENT BASED ON YOUR NEED
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
    // THIS IS ANGULAR MATERIAL CODE END
  ],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
})
export class DateComponent implements OnInit {

  @Input() mode: 'single' | 'range' = 'single';
  @Input() label: string = '';
  @Input() placeholder: string = 'MM/DD/YYYY';
  @Input() endDatePlaceholder: string = 'MM/DD/YYYY';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() initialValues: { date?: string; startDate?: string; endDate?: string; } | null = null;
  @Input() inputClass: string = '';
  @Input() error: string = '';

  // form: FormGroup;
  form: FormGroup = new FormGroup({});
  @Output() valueChanges = new EventEmitter<any>();
  
  ngOnInit(): void{
    this.buildForm();
    this.form.valueChanges.subscribe(values => {
      this.valueChanges.emit(values);
    })
  }

  private buildForm(): void {
    if (this.mode === 'single') {
      this.form = new FormGroup({
        date: new FormControl({value: this.initialValues?.date || '', disabled: this.disabled}, Validators.required)
      });
    } else if (this.mode === 'range') {
      this.form = new FormGroup({
        startDate: new FormControl({value: this.initialValues?.startDate || '', disabled: this.disabled}, Validators.required),
        endDate: new FormControl({value: this.initialValues?.endDate || '', disabled: this.disabled}, Validators.required)
      });
    }
  }
  
}