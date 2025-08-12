import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalMessageComponent } from './temporal-message.component';

describe('TemporalMessageComponent', () => {
  let component: TemporalMessageComponent;
  let fixture: ComponentFixture<TemporalMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporalMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
