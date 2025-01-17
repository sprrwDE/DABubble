import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactProfilePopupComponent } from './contact-profile-popup.component';

describe('ContactProfilePopupComponent', () => {
  let component: ContactProfilePopupComponent;
  let fixture: ComponentFixture<ContactProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactProfilePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
