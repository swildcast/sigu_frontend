import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgramaService } from './programa';

describe('ProgramaService', () => {
  let service: ProgramaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProgramaService]
    });
    service = TestBed.inject(ProgramaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch programs', () => {
    const mockPrograms = [{ id: 1, name: 'Programa Test', description: 'Test description', duration: 4 }];

    service.getProgramas().subscribe(programs => {
      expect(programs).toEqual(mockPrograms);
    });

    const req = httpMock.expectOne('/api/programas');
    expect(req.request.method).toBe('GET');
    req.flush(mockPrograms);
  });
});
