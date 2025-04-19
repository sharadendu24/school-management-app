import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdCardPdfComponent } from './id-card-pdf.component';

describe('IdCardPdfComponent', () => {
  let component: IdCardPdfComponent;
  let fixture: ComponentFixture<IdCardPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdCardPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdCardPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
