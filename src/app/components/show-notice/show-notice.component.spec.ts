import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNoticeComponent } from './show-notice.component';

describe('ShowNoticeComponent', () => {
  let component: ShowNoticeComponent;
  let fixture: ComponentFixture<ShowNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
