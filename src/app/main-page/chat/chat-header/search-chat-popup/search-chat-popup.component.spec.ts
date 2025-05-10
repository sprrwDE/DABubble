import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChatPopupComponent } from './search-chat-popup.component';

describe('SearchChatPopupComponent', () => {
  let component: SearchChatPopupComponent;
  let fixture: ComponentFixture<SearchChatPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchChatPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchChatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
