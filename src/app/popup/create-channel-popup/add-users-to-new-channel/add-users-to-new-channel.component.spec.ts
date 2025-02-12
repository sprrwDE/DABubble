import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsersToNewChannelComponent } from './add-users-to-new-channel.component';

describe('AddUsersToNewChannelComponent', () => {
  let component: AddUsersToNewChannelComponent;
  let fixture: ComponentFixture<AddUsersToNewChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUsersToNewChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUsersToNewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
