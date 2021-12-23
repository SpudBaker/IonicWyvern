import { TestBed } from '@angular/core/testing';

import { WyvernService } from './wyvern.service';

describe('WyvernService', () => {
  let service: WyvernService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WyvernService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
