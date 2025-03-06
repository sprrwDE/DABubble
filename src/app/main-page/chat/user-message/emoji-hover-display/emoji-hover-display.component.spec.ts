import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiHoverDisplayComponent } from './emoji-hover-display.component';

describe('EmojiHoverDisplayComponent', () => {
  let component: EmojiHoverDisplayComponent;
  let fixture: ComponentFixture<EmojiHoverDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiHoverDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojiHoverDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
