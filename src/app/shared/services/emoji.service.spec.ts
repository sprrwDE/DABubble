import { TestBed } from '@angular/core/testing';

import { EmojiCounterService } from './emoji-counter.service';

describe('EmojiServiceService', () => {
  let service: EmojiCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmojiCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
