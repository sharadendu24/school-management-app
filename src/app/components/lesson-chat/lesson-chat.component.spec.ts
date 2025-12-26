import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonChatComponent } from './lesson-chat.component';

describe('LessonChatComponent', () => {
  let component: LessonChatComponent;
  let fixture: ComponentFixture<LessonChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
