import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDetailsPopupComponent } from './channel-details-popup.component';

describe('ChannelDetailsPopupComponent', () => {
  let component: ChannelDetailsPopupComponent;
  let fixture: ComponentFixture<ChannelDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelDetailsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
