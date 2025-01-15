import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMenuPopupComponent } from './profile-menu-popup.component';

describe('ProfileMenuPopupComponent', () => {
  let component: ProfileMenuPopupComponent;
  let fixture: ComponentFixture<ProfileMenuPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMenuPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
