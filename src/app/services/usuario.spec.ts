import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService, Usuario } from './usuario';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/usuarios`;

  // Datos mock realistas
  const mockUsuarios: Usuario[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@universidad.edu', rol: 'estudiante' },
    { id: 2, nombre: 'María García', email: 'maria.garcia@universidad.edu', rol: 'estudiante' },
    { id: 3, nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@universidad.edu', rol: 'docente' },
    { id: 4, nombre: 'Ana López', email: 'ana.lopez@universidad.edu', rol: 'docente' },
    { id: 5, nombre: 'Pedro Martínez', email: 'pedro.martinez@universidad.edu', rol: 'administrador' },
    { id: 6, nombre: 'Laura Sánchez', email: 'laura.sanchez@universidad.edu', rol: 'administrador' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsuarios - READ', () => {
    it('should return an observable of Usuario[] with multiple items', () => {
      service.getUsuarios().subscribe(usuarios => {
        expect(usuarios.length).toBe(6);
        expect(usuarios).toEqual(mockUsuarios);
        expect(usuarios[0].nombre).toBe('Juan Pérez');
        expect(usuarios[0].email).toBe('juan.perez@universidad.edu');
        expect(usuarios[0].rol).toBe('estudiante');
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuarios);
    });

    it('should handle empty array response', () => {
      service.getUsuarios().subscribe(usuarios => {
        expect(usuarios).toEqual([]);
        expect(usuarios.length).toBe(0);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should filter usuarios by role in response', () => {
      const estudiantes = mockUsuarios.filter(u => u.rol === 'estudiante');

      service.getUsuarios().subscribe(usuarios => {
        const estudiantesResponse = usuarios.filter(u => u.rol === 'estudiante');
        expect(estudiantesResponse.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush(mockUsuarios);
    });

    it('should handle HTTP 500 error', () => {
      service.getUsuarios().subscribe({
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

    it('should handle network error', () => {
      service.getUsuarios().subscribe({
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

  describe('getUsuario - READ by ID', () => {
    it('should return a single Usuario by id', () => {
      const mockUsuario = mockUsuarios[0];

      service.getUsuario(1).subscribe(usuario => {
        expect(usuario).toEqual(mockUsuario);
        expect(usuario.id).toBe(1);
        expect(usuario.nombre).toBe('Juan Pérez');
        expect(usuario.email).toBe('juan.perez@universidad.edu');
        expect(usuario.rol).toBe('estudiante');
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });

    it('should return usuario with different id and role', () => {
      const mockUsuario = mockUsuarios[2];

      service.getUsuario(3).subscribe(usuario => {
        expect(usuario.id).toBe(3);
        expect(usuario.nombre).toBe('Carlos Rodríguez');
        expect(usuario.rol).toBe('docente');
      });

      const req = httpMock.expectOne(`${baseUrl}/3`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });

    it('should handle HTTP 404 error when usuario not found', () => {
      service.getUsuario(999).subscribe({
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

  describe('createUsuario - CREATE', () => {
    it('should create a new usuario and return it with id', () => {
      const newUsuario: Usuario = {
        nombre: 'Roberto Silva',
        email: 'roberto.silva@universidad.edu',
        rol: 'estudiante'
      };

      const createdUsuario: Usuario = {
        id: 7,
        ...newUsuario
      };

      service.createUsuario(newUsuario).subscribe(usuario => {
        expect(usuario).toEqual(createdUsuario);
        expect(usuario.id).toBe(7);
        expect(usuario.nombre).toBe('Roberto Silva');
        expect(usuario.email).toBe('roberto.silva@universidad.edu');
        expect(usuario.rol).toBe('estudiante');
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUsuario);
      expect(req.request.body.id).toBeUndefined();
      req.flush(createdUsuario);
    });

    it('should create usuario with role docente', () => {
      const newUsuario: Usuario = {
        nombre: 'Prof. Elena Vega',
        email: 'elena.vega@universidad.edu',
        rol: 'docente'
      };

      const createdUsuario: Usuario = { id: 8, ...newUsuario };

      service.createUsuario(newUsuario).subscribe(usuario => {
        expect(usuario.rol).toBe('docente');
        expect(usuario.id).toBe(8);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(createdUsuario);
    });

    it('should create usuario with role administrador', () => {
      const newUsuario: Usuario = {
        nombre: 'Admin. Diego Torres',
        email: 'diego.torres@universidad.edu',
        rol: 'administrador'
      };

      const createdUsuario: Usuario = { id: 9, ...newUsuario };

      service.createUsuario(newUsuario).subscribe(usuario => {
        expect(usuario.rol).toBe('administrador');
        expect(usuario.id).toBe(9);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(createdUsuario);
    });

    it('should handle HTTP 400 error when creation fails - Bad Request', () => {
      const invalidUsuario: Usuario = {
        nombre: '',
        email: 'invalid-email',
        rol: ''
      };

      service.createUsuario(invalidUsuario).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP 409 error when email already exists', () => {
      const newUsuario: Usuario = {
        nombre: 'Juan Pérez Duplicado',
        email: 'juan.perez@universidad.edu',
        rol: 'estudiante'
      };

      service.createUsuario(newUsuario).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
          expect(error.statusText).toBe('Conflict');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('updateUsuario - UPDATE', () => {
    it('should update an existing usuario successfully', () => {
      const updatedUsuario: Usuario = {
        id: 1,
        nombre: 'Juan Pérez Actualizado',
        email: 'juan.perez.nuevo@universidad.edu',
        rol: 'docente'
      };

      service.updateUsuario(1, updatedUsuario).subscribe(usuario => {
        expect(usuario).toEqual(updatedUsuario);
        expect(usuario.nombre).toBe('Juan Pérez Actualizado');
        expect(usuario.email).toBe('juan.perez.nuevo@universidad.edu');
        expect(usuario.rol).toBe('docente');
        expect(usuario.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUsuario);
      req.flush(updatedUsuario);
    });

    it('should update usuario role from estudiante to docente', () => {
      const updatedUsuario: Usuario = {
        id: 2,
        nombre: 'María García',
        email: 'maria.garcia@universidad.edu',
        rol: 'docente'
      };

      service.updateUsuario(2, updatedUsuario).subscribe(usuario => {
        expect(usuario.rol).toBe('docente');
        expect(usuario.email).toBe('maria.garcia@universidad.edu');
      });

      const req = httpMock.expectOne(`${baseUrl}/2`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedUsuario);
    });

    it('should handle HTTP 404 error when usuario not found', () => {
      const updatedUsuario: Usuario = {
        id: 999,
        nombre: 'Usuario Inexistente',
        email: 'inexistente@universidad.edu',
        rol: 'estudiante'
      };

      service.updateUsuario(999, updatedUsuario).subscribe({
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
      const invalidUsuario: Usuario = {
        id: 1,
        nombre: '',
        email: 'invalid-email',
        rol: 'invalid-role'
      };

      service.updateUsuario(1, invalidUsuario).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteUsuario - DELETE', () => {
    it('should delete a usuario successfully and return void', () => {
      service.deleteUsuario(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 200, statusText: 'OK' });
    });

    it('should delete usuario with different id', () => {
      service.deleteUsuario(5).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 200, statusText: 'OK' });
    });

    it('should handle HTTP 404 error when usuario not found', () => {
      service.deleteUsuario(999).subscribe({
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
      service.deleteUsuario(1).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      req.flush('Internal Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('should handle HTTP 403 error when usuario has active records', () => {
      service.deleteUsuario(1).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(error.statusText).toBe('Forbidden');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });
});
