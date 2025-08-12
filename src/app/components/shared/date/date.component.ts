// --- src/app/components/shared/date/date.component.ts ---
import { Component, OnInit, AfterContentChecked, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
// import { DatepickerModule, TruncateModule } from '@my-app/ui-library';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
  // encapsulation: ViewEncapsulation.None,
  providers: [

  ]
})
export class DateComponent implements OnInit, AfterContentChecked {

  form: FormGroup;
  // private title: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      single1: new FormControl('', Validators.required),
      range1: new FormControl('', Validators.required),
      range1_2: new FormControl('', Validators.required),
      single2: new FormControl('', Validators.required),
      range2: new FormControl('', Validators.required),
      range2_2: new FormControl('', Validators.required),
      single3: new FormControl('', Validators.required),
      range3: new FormControl('', Validators.required),
      range3_2: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {

  }

  ngAfterContentChecked(): void {
    const date = new Date('2023-04-28');
    this.form.patchValue({ single1: date });

    const range1 = new Date('2023-10-18');
    this.form.patchValue({ single2: range1 });

    const range2 = new Date('2023-10-29');
    this.form.patchValue({ single3: range2 });
  }

  onDateInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue += value.slice(0, 2);
    }
    if (value.length > 2) {
      formattedValue += '/' + value.slice(2, 4);
    }
    if (value.length > 4) {
      formattedValue += '/' + value.slice(4, 8);
    }

    event.target.value = formattedValue;

    this.form.get('single1')?.setValue(formattedValue, { emitEvent: false });
  }
}


