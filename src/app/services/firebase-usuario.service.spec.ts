import { TestBed } from '@angular/core/testing';

import { FirebaseUsuarioService } from './firebase-usuario.service';

describe('FirebaseUsuarioService', () => {
  let service: FirebaseUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseUsuarioService);
  });

  /*it('should be created', () => {
    expect(service).toBeTruthy();
  });*/
});
