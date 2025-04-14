import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksManagementComponent } from './marks-management.component';

describe('MarksManagementComponent', () => {
  let component: MarksManagementComponent;
  let fixture: ComponentFixture<MarksManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
