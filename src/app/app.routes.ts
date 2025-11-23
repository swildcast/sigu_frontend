 import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/materias',
    pathMatch: 'full'
  },
  // {
  //   path: 'inscriptions',
  //   loadComponent: () => import('./components/inscription-list/inscription-list').then(m => m.InscriptionListComponent)
  // },
  {
    path: 'materias',
    loadComponent: () => import('./components/materia-list/materia-list').then(m => m.MateriasListComponent)
  },
  {
    path: 'programas',
    loadComponent: () => import('./components/programa-list/programa-list').then(m => m.ProgramaListComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./components/usuarios-list/usuarios-list').then(m => m.UsuariosListComponent)
  }
];
