import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListPopupComponent } from './member-list-popup.component';

describe('MemberListPopupComponent', () => {
  let component: MemberListPopupComponent;
  let fixture: ComponentFixture<MemberListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberListPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
