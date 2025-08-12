import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLegacyComponent } from './input-legacy.component';

describe('InputLegacyComponent', () => {
  let component: InputLegacyComponent;
  let fixture: ComponentFixture<InputLegacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputLegacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputLegacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
