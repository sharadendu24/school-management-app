import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICardComponent } from './i-card.component';

describe('ICardComponent', () => {
  let component: ICardComponent;
  let fixture: ComponentFixture<ICardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ICardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ICardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
