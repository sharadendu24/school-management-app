import { TestBed } from '@angular/core/testing';

import { ErrorhandlingserviceService } from './errorhandlingservice.service';

describe('ErrorhandlingserviceService', () => {
  let service: ErrorhandlingserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorhandlingserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
