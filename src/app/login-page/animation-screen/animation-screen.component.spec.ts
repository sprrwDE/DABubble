import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationScreenComponent } from './animation-screen.component';

describe('AnimationScreenComponent', () => {
  let component: AnimationScreenComponent;
  let fixture: ComponentFixture<AnimationScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
