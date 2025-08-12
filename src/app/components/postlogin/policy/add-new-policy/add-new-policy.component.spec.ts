import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPolicyComponent } from './add-new-policy.component';

describe('AddNewPolicyComponent', () => {
  let component: AddNewPolicyComponent;
  let fixture: ComponentFixture<AddNewPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
