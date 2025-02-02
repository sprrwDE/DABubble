import { TestBed } from '@angular/core/testing';

import { SearchChatService } from './search-chat.service';

describe('SearchChatService', () => {
  let service: SearchChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
