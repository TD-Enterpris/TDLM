import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppPoliciesComponent } from './my-app-policies.component';

describe('MyAppPoliciesComponent', () => {
  let component: MyAppPoliciesComponent;
  let fixture: ComponentFixture<MyAppPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAppPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAppPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
