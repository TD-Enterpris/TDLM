import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  @Input() heading: string = 'Loading...'; // Default heading
  @Input() message: string = 'Please wait'; // Default message
  @Input() isVisible: boolean = false; // Control visibility dynamically
}
