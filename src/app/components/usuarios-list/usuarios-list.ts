import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Usuario, UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuarios-list.html',
  styleUrls: ['./usuarios-list.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  showForm = false;
  editingUsuario: Usuario | null = null;

  newUsuario: Usuario = {
    nombre: '',
    email: '',
    rol: 'estudiante'
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => console.error('Error cargando usuarios:', error)
    });
  }

  createUsuario() {
    this.usuarioService.createUsuario(this.newUsuario).subscribe({
      next: () => {
        this.loadUsuarios();
        this.resetForm();
        this.showForm = false;
      },
      error: (error) => console.error('Error creando usuario:', error)
    });
  }

  editUsuario(usuario: Usuario) {
    this.editingUsuario = { ...usuario };
    this.showForm = true;
  }

  updateUsuario() {
    if (this.editingUsuario && this.editingUsuario.id) {
      this.usuarioService.updateUsuario(this.editingUsuario.id, this.editingUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.cancelEdit();
        },
        error: (error) => console.error('Error actualizando usuario:', error)
      });
    }
  }

  deleteUsuario(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => this.loadUsuarios(),
        error: (error) => console.error('Error eliminando usuario:', error)
      });
    }
  }

  cancelEdit() {
    this.editingUsuario = null;
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newUsuario = {
      nombre: '',
      email: '',
      rol: 'estudiante'
    };
  }
}
