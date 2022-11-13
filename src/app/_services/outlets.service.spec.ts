import { TestBed } from '@angular/core/testing';

import { OutletsService } from './outlets.service';

describe('OutletsService', () => {
  let service: OutletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
