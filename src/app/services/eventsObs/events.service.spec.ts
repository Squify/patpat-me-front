import { TestBed } from '@angular/core/testing';

import { UpdateService } from './update.service';

describe('EventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateService = TestBed.get(UpdateService);
    expect(service).toBeTruthy();
  });
});
