import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDashboardComponent } from './policy-dashboard.component';

describe('PolicyDashboardComponent', () => {
  let component: PolicyDashboardComponent;
  let fixture: ComponentFixture<PolicyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
