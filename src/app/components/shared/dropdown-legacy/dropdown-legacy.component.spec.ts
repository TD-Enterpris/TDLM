import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownLegacyComponent } from './dropdown-legacy.component';

describe('DropdownLegacyComponent', () => {
  let component: DropdownLegacyComponent;
  let fixture: ComponentFixture<DropdownLegacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownLegacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownLegacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
