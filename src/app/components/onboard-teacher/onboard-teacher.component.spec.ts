import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardTeacherComponent } from './onboard-teacher.component';

describe('OnboardTeacherComponent', () => {
  let component: OnboardTeacherComponent;
  let fixture: ComponentFixture<OnboardTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
