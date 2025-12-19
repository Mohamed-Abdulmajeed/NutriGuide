import { TestBed } from '@angular/core/testing';

import { Alertnotification } from './alertnotification';

describe('Alertnotification', () => {
  let service: Alertnotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alertnotification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
