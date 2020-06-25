import { TestBed } from '@angular/core/testing';

import { MeetService } from './meet.service';

describe('MeetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetService = TestBed.get(MeetService);
    expect(service).toBeTruthy();
  });
});
