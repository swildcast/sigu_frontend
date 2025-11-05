import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Materia, MateriaService } from '../../services/materia';

@Component({
  selector: 'app-materias-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './materias-list.component.html',
  styleUrls: ['./materias-list.component.scss']
})
export class MateriasListComponent implements OnInit {
  materias: Materia[] = [];
  showForm = false;
  editingMateria: Materia | null = null;

  newMateria: Materia = {
    codigo: '',
    nombre: '',
    creditos: 0
  };

  constructor(private materiaService: MateriaService) {}

  ngOnInit() {
    this.loadMaterias(); // ← Asegúrate que esta línea esté activa

    // COMENTA o ELIMINA los datos de prueba:
    // this.materias = [
    //   { id: 1, codigo: 'MAT101', nombre: 'Matemáticas Básicas', creditos: 4 },
    //   { id: 2, codigo: 'PROG202', nombre: 'Programación I', creditos: 3 },
    //   { id: 3, codigo: 'BD301', nombre: 'Base de Datos', creditos: 4 }
    // ];
  }

  loadMaterias() {
    this.materiaService.getMaterias().subscribe({
      next: (data) => this.materias = data,
      error: (error) => console.error('Error cargando materias:', error)
    });
  }

  createMateria() {
    this.materiaService.createMateria(this.newMateria).subscribe({
      next: () => {
        this.loadMaterias();
        this.resetForm();
        this.showForm = false;
      },
      error: (error) => console.error('Error creando materia:', error)
    });
  }

  editMateria(materia: Materia) {
    this.editingMateria = { ...materia };
    this.showForm = true;
  }

  updateMateria() {
    if (this.editingMateria && this.editingMateria.id) {
      this.materiaService.updateMateria(this.editingMateria.id, this.editingMateria).subscribe({
        next: () => {
          this.loadMaterias();
          this.cancelEdit();
        },
        error: (error) => console.error('Error actualizando materia:', error)
      });
    }
  }

  deleteMateria(id: number) {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
      this.materiaService.deleteMateria(id).subscribe({
        next: () => this.loadMaterias(),
        error: (error) => console.error('Error eliminando materia:', error)
      });
    }
  }

  cancelEdit() {
    this.editingMateria = null;
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newMateria = {
      codigo: '',
      nombre: '',
      creditos: 0
    };
  }
}
