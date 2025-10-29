import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Materia, MateriaService } from '../../services/materia';

@Component({
  selector: 'app-materia-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './materia-list.html',
  styleUrls: ['./materia-list.scss']
})
export class MateriaListComponent implements OnInit {
  materias: Materia[] = [];
  showForm = false;
  editingMateria: Materia | null = null;

  newMateria: Materia = {
    name: '',
    description: '',
    credits: 0
  };

  constructor(private materiaService: MateriaService) {}

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.materiaService.getMaterias().subscribe({
      next: (data) => this.materias = data,
      error: (error) => console.error('Error loading materias:', error)
    });
  }

  createMateria() {
    this.materiaService.createMateria(this.newMateria).subscribe({
      next: () => {
        this.loadMaterias();
        this.resetForm();
        this.showForm = false;
      },
      error: (error) => console.error('Error creating materia:', error)
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
        error: (error) => console.error('Error updating materia:', error)
      });
    }
  }

  deleteMateria(id: number) {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
      this.materiaService.deleteMateria(id).subscribe({
        next: () => this.loadMaterias(),
        error: (error) => console.error('Error deleting materia:', error)
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
      name: '',
      description: '',
      credits: 0
    };
  }
}
