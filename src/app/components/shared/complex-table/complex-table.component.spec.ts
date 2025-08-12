import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexTableComponent } from './complex-table.component';

describe('ComplexTableComponent', () => {
  let component: ComplexTableComponent;
  let fixture: ComponentFixture<ComplexTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplexTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplexTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
