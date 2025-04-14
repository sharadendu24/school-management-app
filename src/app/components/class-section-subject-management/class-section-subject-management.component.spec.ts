import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSectionSubjectManagementComponent } from './class-section-subject-management.component';

describe('ClassSectionSubjectManagementComponent', () => {
  let component: ClassSectionSubjectManagementComponent;
  let fixture: ComponentFixture<ClassSectionSubjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSectionSubjectManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSectionSubjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
