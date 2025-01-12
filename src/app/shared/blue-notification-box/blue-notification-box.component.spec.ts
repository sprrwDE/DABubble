import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueNotificationBoxComponent } from './blue-notification-box.component';

describe('BlueNotificationBoxComponent', () => {
  let component: BlueNotificationBoxComponent;
  let fixture: ComponentFixture<BlueNotificationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueNotificationBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlueNotificationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
