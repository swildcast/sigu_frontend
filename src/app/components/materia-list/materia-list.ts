import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Materia, MateriaService } from '../../services/materia';
import { Prerrequisito, PrerrequisitoService } from '../../services/prerrequisito';

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

  // Prerrequisitos logic
  showPrerrequisitosModal = false;
  selectedMateriaForPrerrequisitos: Materia | null = null;
  currentPrerrequisitos: Prerrequisito[] = [];
  allPrerrequisitos: Prerrequisito[] = [];
  newPrerrequisitoId: number | null = null;

  newMateria: Materia = {
    codigo: '',
    nombre: '',
    creditos: 0
  };

  constructor(
    private materiaService: MateriaService,
    private prerrequisitoService: PrerrequisitoService
  ) { }

  ngOnInit() {
    this.loadMaterias();
    this.loadAllPrerrequisitos();
  }

  loadMaterias() {
    this.materiaService.getMaterias().subscribe({
      next: (data) => this.materias = data,
      error: (error) => console.error('Error cargando materias:', error)
    });
  }

  loadAllPrerrequisitos() {
    this.prerrequisitoService.getPrerrequisitos().subscribe({
      next: (data) => this.allPrerrequisitos = data,
      error: (error) => console.error('Error cargando prerrequisitos:', error)
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

  // --- Prerrequisitos Methods ---

  openPrerrequisitos(materia: Materia) {
    this.selectedMateriaForPrerrequisitos = materia;
    this.filterPrerrequisitos();
    this.showPrerrequisitosModal = true;
  }

  filterPrerrequisitos() {
    if (this.selectedMateriaForPrerrequisitos && this.selectedMateriaForPrerrequisitos.id) {
      const materiaId = this.selectedMateriaForPrerrequisitos.id;
      this.currentPrerrequisitos = this.allPrerrequisitos.filter(p => p.idMateria === materiaId);
    }
  }

  closePrerrequisitos() {
    this.showPrerrequisitosModal = false;
    this.selectedMateriaForPrerrequisitos = null;
    this.newPrerrequisitoId = null;
  }

  addPrerrequisito() {
    if (this.selectedMateriaForPrerrequisitos && this.newPrerrequisitoId) {
      const newPre: Prerrequisito = {
        idMateria: this.selectedMateriaForPrerrequisitos.id!,
        idMateriaReq: this.newPrerrequisitoId
      };

      this.prerrequisitoService.createPrerrequisito(newPre).subscribe({
        next: (created) => {
          this.allPrerrequisitos.push(created);
          this.filterPrerrequisitos();
          this.newPrerrequisitoId = null;
          // Recargar para traer los objetos completos (nombres de materias) si el backend no los devuelve poblados
          this.loadAllPrerrequisitos();
        },
        error: (error) => console.error('Error agregando prerrequisito:', error)
      });
    }
  }

  removePrerrequisito(id: number) {
    if (confirm('¿Eliminar prerrequisito?')) {
      this.prerrequisitoService.deletePrerrequisito(id).subscribe({
        next: () => {
          this.allPrerrequisitos = this.allPrerrequisitos.filter(p => p.id !== id);
          this.filterPrerrequisitos();
        },
        error: (error) => console.error('Error eliminando prerrequisito:', error)
      });
    }
  }

  getAvailableMaterias(): Materia[] {
    if (!this.selectedMateriaForPrerrequisitos) return [];

    // Excluir la materia misma y las que ya son prerrequisitos
    const currentReqIds = this.currentPrerrequisitos.map(p => p.idMateriaReq);
    return this.materias.filter(m =>
      m.id !== this.selectedMateriaForPrerrequisitos?.id &&
      !currentReqIds.includes(m.id!)
    );
  }
}
