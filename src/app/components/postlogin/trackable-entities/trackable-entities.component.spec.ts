import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackableEntitiesComponent } from './trackable-entities.component';

describe('TrackableEntitiesComponent', () => {
  let component: TrackableEntitiesComponent;
  let fixture: ComponentFixture<TrackableEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackableEntitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackableEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
