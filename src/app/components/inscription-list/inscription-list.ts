import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Inscription, InscriptionService } from '../../services/inscription.service';

@Component({
  selector: 'app-inscription-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './inscription-list.html',
  styleUrls: ['./inscription-list.scss']
})
export class InscriptionListComponent implements OnInit {
  inscriptions: Inscription[] = [];
  showForm = false;
  editingInscription: Inscription | null = null;
  
  newInscription: Inscription = {
    name: '',
    email: '',
    program: '',
    inscriptionDate: new Date().toISOString().split('T')[0]
  };

  constructor(private inscriptionService: InscriptionService) {}

  ngOnInit() {
    this.loadInscriptions();
  }

  loadInscriptions() {
    this.inscriptionService.getInscriptions().subscribe({
      next: (data) => this.inscriptions = data,
      error: (error) => console.error('Error loading inscriptions:', error)
    });
  }

  createInscription() {
    this.inscriptionService.createInscription(this.newInscription).subscribe({
      next: () => {
        this.loadInscriptions();
        this.resetForm();
        this.showForm = false;
      },
      error: (error) => console.error('Error creating inscription:', error)
    });
  }

  editInscription(inscription: Inscription) {
    this.editingInscription = { ...inscription };
    this.showForm = true;
  }

  updateInscription() {
    if (this.editingInscription && this.editingInscription.id) {
      this.inscriptionService.updateInscription(this.editingInscription.id, this.editingInscription).subscribe({
        next: () => {
          this.loadInscriptions();
          this.cancelEdit();
        },
        error: (error) => console.error('Error updating inscription:', error)
      });
    }
  }

  deleteInscription(id: number) {
    if (confirm('¿Está seguro de eliminar esta inscripción?')) {
      this.inscriptionService.deleteInscription(id).subscribe({
        next: () => this.loadInscriptions(),
        error: (error) => console.error('Error deleting inscription:', error)
      });
    }
  }

  cancelEdit() {
    this.editingInscription = null;
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newInscription = {
      name: '',
      email: '',
      program: '',
      inscriptionDate: new Date().toISOString().split('T')[0]
    };
  }
}