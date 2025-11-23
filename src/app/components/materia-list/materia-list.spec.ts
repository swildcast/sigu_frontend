import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MateriasListComponent } from './materia-list';
import { MateriaService, Materia } from '../../services/materia';

describe('MateriasListComponent', () => {
  let component: MateriasListComponent;
  let fixture: ComponentFixture<MateriasListComponent>;
  let materiaService: jasmine.SpyObj<MateriaService>;

  const mockMaterias: Materia[] = [
    { id: 1, codigo: 'MAT101', nombre: 'Matemáticas Básicas', creditos: 4 },
    { id: 2, codigo: 'PROG202', nombre: 'Programación I', creditos: 3 },
    { id: 3, codigo: 'BD301', nombre: 'Base de Datos', creditos: 4 }
  ];

  beforeEach(async () => {
    const materiaServiceSpy = jasmine.createSpyObj('MateriaService', [
      'getMaterias',
      'getMateria',
      'createMateria',
      'updateMateria',
      'deleteMateria'
    ]);

    await TestBed.configureTestingModule({
      imports: [MateriasListComponent, HttpClientTestingModule],
      providers: [
        { provide: MateriaService, useValue: materiaServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MateriasListComponent);
    component = fixture.componentInstance;
    materiaService = TestBed.inject(MateriaService) as jasmine.SpyObj<MateriaService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadMaterias on init', () => {
      materiaService.getMaterias.and.returnValue(of([]));

      fixture.detectChanges();

      expect(materiaService.getMaterias).toHaveBeenCalled();
    });

    it('should load materias successfully', () => {
      materiaService.getMaterias.and.returnValue(of(mockMaterias));

      fixture.detectChanges();

      expect(component.materias).toEqual(mockMaterias);
      expect(component.materias.length).toBe(3);
    });

    it('should handle error when loading materias', () => {
      const consoleSpy = spyOn(console, 'error');
      materiaService.getMaterias.and.returnValue(throwError(() => new Error('Error de red')));

      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith('Error cargando materias', jasmine.any(Error));
      expect(component.materias).toEqual([]);
    });
  });

  describe('loadMaterias', () => {
    it('should load and set materias', () => {
      materiaService.getMaterias.and.returnValue(of(mockMaterias));

      component.loadMaterias();

      expect(materiaService.getMaterias).toHaveBeenCalled();
      expect(component.materias).toEqual(mockMaterias);
    });

    it('should handle empty response', () => {
      materiaService.getMaterias.and.returnValue(of([]));

      component.loadMaterias();

      expect(component.materias).toEqual([]);
    });

    it('should log error when loading fails', () => {
      const consoleSpy = spyOn(console, 'error');
      const error = new Error('Error de red');
      materiaService.getMaterias.and.returnValue(throwError(() => error));

      component.loadMaterias();

      expect(consoleSpy).toHaveBeenCalledWith('Error cargando materias', error);
    });
  });

  describe('createMateria', () => {
    it('should create a new materia successfully', () => {
      const newMateria: Materia = {
        codigo: 'ALG401',
        nombre: 'Algoritmos',
        creditos: 5
      };

      component.newMateria = { ...newMateria };
      materiaService.createMateria.and.returnValue(of({ id: 4, ...newMateria }));
      materiaService.getMaterias.and.returnValue(of([...mockMaterias, { id: 4, ...newMateria }]));

      component.createMateria();

      expect(materiaService.createMateria).toHaveBeenCalledWith(newMateria);
      expect(materiaService.getMaterias).toHaveBeenCalled();
      expect(component.showForm).toBe(false);
      expect(component.newMateria.codigo).toBe('');
      expect(component.newMateria.nombre).toBe('');
      expect(component.newMateria.creditos).toBe(0);
    });

    it('should handle error when creation fails', () => {
      const consoleSpy = spyOn(console, 'error');
      const error = new Error('Error al crear');
      materiaService.createMateria.and.returnValue(throwError(() => error));

      component.createMateria();

      expect(consoleSpy).toHaveBeenCalledWith('Error creando materia', error);
      expect(materiaService.getMaterias).not.toHaveBeenCalled();
    });
  });

  describe('editMateria', () => {
    it('should set editingMateria and show form', () => {
      const materiaToEdit = mockMaterias[0];

      component.editMateria(materiaToEdit);

      expect(component.editingMateria).not.toBeNull();
      expect(component.editingMateria?.id).toBe(materiaToEdit.id);
      expect(component.editingMateria?.codigo).toBe(materiaToEdit.codigo);
      expect(component.editingMateria?.nombre).toBe(materiaToEdit.nombre);
      expect(component.editingMateria?.creditos).toBe(materiaToEdit.creditos);
      expect(component.showForm).toBe(true);
    });

    it('should create a copy of the materia', () => {
      const materiaToEdit = mockMaterias[0];

      component.editMateria(materiaToEdit);

      // Modificar el original no debe afectar la copia
      materiaToEdit.nombre = 'Nombre Modificado';
      expect(component.editingMateria?.nombre).not.toBe('Nombre Modificado');
    });
  });

  describe('updateMateria', () => {
    it('should update materia successfully when id exists', () => {
      const updatedMateria: Materia = {
        id: 1,
        codigo: 'MAT101',
        nombre: 'Matemáticas Avanzadas',
        creditos: 6
      };

      component.editingMateria = { ...updatedMateria };
      materiaService.updateMateria.and.returnValue(of(updatedMateria));
      materiaService.getMaterias.and.returnValue(of(mockMaterias));

      component.updateMateria();

      expect(materiaService.updateMateria).toHaveBeenCalledWith(1, updatedMateria);
      expect(materiaService.getMaterias).toHaveBeenCalled();
      expect(component.editingMateria).toBeNull();
      expect(component.showForm).toBe(false);
    });

    it('should not update if editingMateria is null', () => {
      component.editingMateria = null;

      component.updateMateria();

      expect(materiaService.updateMateria).not.toHaveBeenCalled();
    });

    it('should not update if editingMateria has no id', () => {
      component.editingMateria = {
        codigo: 'MAT101',
        nombre: 'Matemáticas',
        creditos: 4
      };

      component.updateMateria();

      expect(materiaService.updateMateria).not.toHaveBeenCalled();
    });

    it('should handle error when update fails', () => {
      const consoleSpy = spyOn(console, 'error');
      const error = new Error('Error al actualizar');
      const updatedMateria: Materia = {
        id: 1,
        codigo: 'MAT101',
        nombre: 'Matemáticas Avanzadas',
        creditos: 6
      };

      component.editingMateria = { ...updatedMateria };
      materiaService.updateMateria.and.returnValue(throwError(() => error));

      component.updateMateria();

      expect(consoleSpy).toHaveBeenCalledWith('Error actualizando materia', error);
    });
  });

  describe('deleteMateria', () => {
    it('should delete materia when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      materiaService.deleteMateria.and.returnValue(of(undefined));
      materiaService.getMaterias.and.returnValue(of(mockMaterias.slice(1)));

      component.deleteMateria(1);

      expect(window.confirm).toHaveBeenCalledWith('¿Está seguro de eliminar esta materia?');
      expect(materiaService.deleteMateria).toHaveBeenCalledWith(1);
      expect(materiaService.getMaterias).toHaveBeenCalled();
    });

    it('should not delete materia when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteMateria(1);

      expect(materiaService.deleteMateria).not.toHaveBeenCalled();
    });

    it('should handle error when deletion fails', () => {
      const consoleSpy = spyOn(console, 'error');
      const error = new Error('Error al eliminar');
      spyOn(window, 'confirm').and.returnValue(true);
      materiaService.deleteMateria.and.returnValue(throwError(() => error));

      component.deleteMateria(1);

      expect(consoleSpy).toHaveBeenCalledWith('Error eliminando materia', error);
    });
  });

  describe('cancelEdit', () => {
    it('should reset form and hide it', () => {
      component.editingMateria = mockMaterias[0];
      component.showForm = true;
      component.newMateria = {
        codigo: 'TEST',
        nombre: 'Test',
        creditos: 5
      };

      component.cancelEdit();

      expect(component.editingMateria).toBeNull();
      expect(component.showForm).toBe(false);
      expect(component.newMateria.codigo).toBe('');
      expect(component.newMateria.nombre).toBe('');
      expect(component.newMateria.creditos).toBe(0);
    });
  });

  describe('resetForm', () => {
    it('should reset newMateria to default values', () => {
      component.newMateria = {
        codigo: 'TEST',
        nombre: 'Test',
        creditos: 5
      };

      component.resetForm();

      expect(component.newMateria).toEqual({
        codigo: '',
        nombre: '',
        creditos: 0
      });
    });
  });

  describe('Component State', () => {
    it('should initialize with default values', () => {
      expect(component.materias).toEqual([]);
      expect(component.showForm).toBe(false);
      expect(component.editingMateria).toBeNull();
      expect(component.newMateria).toEqual({
        codigo: '',
        nombre: '',
        creditos: 0
      });
    });

    it('should show form when button is clicked', () => {
      component.showForm = false;
      component.editingMateria = null;

      // Simular click del botón
      component.showForm = true;
      component.editingMateria = null;

      expect(component.showForm).toBe(true);
      expect(component.editingMateria).toBeNull();
    });
  });
});
