import { TestBed } from '@angular/core/testing';

import { CrudViajesService } from './crud-viajes.service';

describe('CrudViajesService', () => {
  let service: CrudViajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudViajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
