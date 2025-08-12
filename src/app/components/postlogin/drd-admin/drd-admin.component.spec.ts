import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrdAdminComponent } from './drd-admin.component';

describe('DrdAdminComponent', () => {
  let component: DrdAdminComponent;
  let fixture: ComponentFixture<DrdAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrdAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrdAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
