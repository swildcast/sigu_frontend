 import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/inscriptions',
    pathMatch: 'full'
  },
  {
    path: 'inscriptions',
    loadComponent: () => import('./components/inscription-list/inscription-list').then(m => m.InscriptionListComponent)
  }
];
