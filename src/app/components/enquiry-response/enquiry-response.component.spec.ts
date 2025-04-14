import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryResponseComponent } from './enquiry-response.component';

describe('EnquiryResponseComponent', () => {
  let component: EnquiryResponseComponent;
  let fixture: ComponentFixture<EnquiryResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
