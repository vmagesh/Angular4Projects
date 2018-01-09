import { TestBed, inject } from '@angular/core/testing';

import { NavTrackerService } from './nav-tracker.service';

describe('NavTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavTrackerService]
    });
  });

  it('should be created', inject([NavTrackerService], (service: NavTrackerService) => {
    expect(service).toBeTruthy();
  }));
});
