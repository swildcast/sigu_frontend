import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MateriaService, Materia } from './materia';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('MateriaService', () => {
  let service: MateriaService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/materias`;

  // Datos mock realistas
  const mockMaterias: Materia[] = [
    { id: 1, codigo: 'MAT101', nombre: 'Matemáticas Básicas', creditos: 4 },
    { id: 2, codigo: 'PROG202', nombre: 'Programación I', creditos: 3 },
    { id: 3, codigo: 'BD301', nombre: 'Base de Datos', creditos: 4 },
    { id: 4, codigo: 'ALG401', nombre: 'Algoritmos y Estructuras de Datos', creditos: 5 },
    { id: 5, codigo: 'RED501', nombre: 'Redes de Computadoras', creditos: 4 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MateriaService]
    });
    service = TestBed.inject(MateriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMaterias - READ', () => {
    it('should return an observable of Materia[] with multiple items', () => {
      service.getMaterias().subscribe(materias => {
        expect(materias.length).toBe(5);
        expect(materias).toEqual(mockMaterias);
        expect(materias[0].codigo).toBe('MAT101');
        expect(materias[0].nombre).toBe('Matemáticas Básicas');
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockMaterias);
    });

    it('should handle empty array response', () => {
      service.getMaterias().subscribe(materias => {
        expect(materias).toEqual([]);
        expect(materias.length).toBe(0);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle HTTP 500 error', () => {
      service.getMaterias().subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Internal Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('should handle HTTP 404 error', () => {
      service.getMaterias().subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle network error', () => {
      service.getMaterias().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.error).toBe('Network Error');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.error(new ErrorEvent('Network Error'), {
        status: 0,
        statusText: 'Unknown Error'
      });
    });
  });

  describe('getMateria - READ by ID', () => {
    it('should return a single Materia by id', () => {
      const mockMateria = mockMaterias[0];

      service.getMateria(1).subscribe(materia => {
        expect(materia).toEqual(mockMateria);
        expect(materia.id).toBe(1);
        expect(materia.codigo).toBe('MAT101');
        expect(materia.nombre).toBe('Matemáticas Básicas');
        expect(materia.creditos).toBe(4);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMateria);
    });

    it('should return materia with different id', () => {
      const mockMateria = mockMaterias[2];

      service.getMateria(3).subscribe(materia => {
        expect(materia.id).toBe(3);
        expect(materia.codigo).toBe('BD301');
        expect(materia.nombre).toBe('Base de Datos');
      });

      const req = httpMock.expectOne(`${baseUrl}/3`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMateria);
    });

    it('should handle HTTP 404 error when materia not found', () => {
      service.getMateria(999).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createMateria - CREATE', () => {
    it('should create a new materia and return it with id', () => {
      const newMateria: Materia = {
        codigo: 'WEB501',
        nombre: 'Desarrollo Web',
        creditos: 4
      };

      const createdMateria: Materia = {
        id: 6,
        ...newMateria
      };

      service.createMateria(newMateria).subscribe(materia => {
        expect(materia).toEqual(createdMateria);
        expect(materia.id).toBe(6);
        expect(materia.codigo).toBe('WEB501');
        expect(materia.nombre).toBe('Desarrollo Web');
        expect(materia.creditos).toBe(4);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newMateria);
      expect(req.request.body.id).toBeUndefined();
      req.flush(createdMateria);
    });

    it('should create materia with maximum creditos', () => {
      const newMateria: Materia = {
        codigo: 'TDP601',
        nombre: 'Trabajo de Diploma',
        creditos: 10
      };

      const createdMateria: Materia = { id: 7, ...newMateria };

      service.createMateria(newMateria).subscribe(materia => {
        expect(materia.creditos).toBe(10);
        expect(materia.id).toBe(7);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(createdMateria);
    });

    it('should handle HTTP 400 error when creation fails - Bad Request', () => {
      const newMateria: Materia = {
        codigo: '',
        nombre: '',
        creditos: -1
      };

      service.createMateria(newMateria).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP 409 error when materia already exists', () => {
      const newMateria: Materia = {
        codigo: 'MAT101',
        nombre: 'Matemáticas Básicas',
        creditos: 4
      };

      service.createMateria(newMateria).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('updateMateria - UPDATE', () => {
    it('should update an existing materia successfully', () => {
      const updatedMateria: Materia = {
        id: 1,
        codigo: 'MAT101',
        nombre: 'Matemáticas Avanzadas',
        creditos: 6
      };

      service.updateMateria(1, updatedMateria).subscribe(materia => {
        expect(materia).toEqual(updatedMateria);
        expect(materia.nombre).toBe('Matemáticas Avanzadas');
        expect(materia.creditos).toBe(6);
        expect(materia.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedMateria);
      req.flush(updatedMateria);
    });

    it('should update materia with different creditos', () => {
      const updatedMateria: Materia = {
        id: 2,
        codigo: 'PROG202',
        nombre: 'Programación Avanzada',
        creditos: 5
      };

      service.updateMateria(2, updatedMateria).subscribe(materia => {
        expect(materia.creditos).toBe(5);
        expect(materia.nombre).toBe('Programación Avanzada');
      });

      const req = httpMock.expectOne(`${baseUrl}/2`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedMateria);
    });

    it('should handle HTTP 404 error when materia not found', () => {
      const updatedMateria: Materia = {
        id: 999,
        codigo: 'TEST999',
        nombre: 'Test Materia',
        creditos: 3
      };

      service.updateMateria(999, updatedMateria).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP 400 error when update data is invalid', () => {
      const invalidMateria: Materia = {
        id: 1,
        codigo: '',
        nombre: '',
        creditos: -1
      };

      service.updateMateria(1, invalidMateria).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteMateria - DELETE', () => {
    it('should delete a materia successfully and return void', () => {
      service.deleteMateria(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 200, statusText: 'OK' });
    });

    it('should delete materia with different id', () => {
      service.deleteMateria(5).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 200, statusText: 'OK' });
    });

    it('should handle HTTP 404 error when materia not found', () => {
      service.deleteMateria(999).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP 500 error when deletion fails', () => {
      service.deleteMateria(1).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      req.flush('Internal Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('should handle HTTP 403 error when materia is in use', () => {
      service.deleteMateria(1).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });
});
