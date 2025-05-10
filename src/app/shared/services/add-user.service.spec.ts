import { TestBed } from '@angular/core/testing';

import { AddUserService } from './add-user.service';

describe('TestService', () => {
  let service: AddUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
