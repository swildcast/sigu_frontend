import { TestBed } from '@angular/core/testing';

import { Programa } from './programa';

describe('Programa', () => {
  let service: Programa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Programa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
