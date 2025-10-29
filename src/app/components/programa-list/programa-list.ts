import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Programa, ProgramaService } from '../../services/programa';

@Component({
  selector: 'app-programa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './programa-list.html',
  styleUrls: ['./programa-list.scss']
})
export class ProgramaListComponent implements OnInit {
  programas: Programa[] = [];
  showForm = false;
  editingPrograma: Programa | null = null;

  newPrograma: Programa = {
    name: '',
    description: '',
    duration: 0
  };

  constructor(private programaService: ProgramaService) {}

  ngOnInit() {
    this.loadProgramas();
  }

  loadProgramas() {
    this.programaService.getProgramas().subscribe({
      next: (data) => this.programas = data,
      error: (error) => console.error('Error loading programas:', error)
    });
  }

  createPrograma() {
    this.programaService.createPrograma(this.newPrograma).subscribe({
      next: () => {
        this.loadProgramas();
        this.resetForm();
        this.showForm = false;
      },
      error: (error) => console.error('Error creating programa:', error)
    });
  }

  editPrograma(programa: Programa) {
    this.editingPrograma = { ...programa };
    this.showForm = true;
  }

  updatePrograma() {
    if (this.editingPrograma && this.editingPrograma.id) {
      this.programaService.updatePrograma(this.editingPrograma.id, this.editingPrograma).subscribe({
        next: () => {
          this.loadProgramas();
          this.cancelEdit();
        },
        error: (error) => console.error('Error updating programa:', error)
      });
    }
  }

  deletePrograma(id: number) {
    if (confirm('¿Está seguro de eliminar este programa?')) {
      this.programaService.deletePrograma(id).subscribe({
        next: () => this.loadProgramas(),
        error: (error) => console.error('Error deleting programa:', error)
      });
    }
  }

  cancelEdit() {
    this.editingPrograma = null;
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newPrograma = {
      name: '',
      description: '',
      duration: 0
    };
  }
}
