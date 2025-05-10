import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToChannelPopupComponent } from './add-user-to-channel-popup.component';

describe('AddUserToChannelPopupComponent', () => {
  let component: AddUserToChannelPopupComponent;
  let fixture: ComponentFixture<AddUserToChannelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserToChannelPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserToChannelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
