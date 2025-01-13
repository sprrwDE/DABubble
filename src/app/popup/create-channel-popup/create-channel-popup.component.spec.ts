import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelPopupComponent } from './create-channel-popup.component';

describe('CreateChannelPopupComponent', () => {
  let component: CreateChannelPopupComponent;
  let fixture: ComponentFixture<CreateChannelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChannelPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChannelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
