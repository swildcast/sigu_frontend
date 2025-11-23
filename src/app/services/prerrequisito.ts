import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Materia } from './materia';

export interface Prerrequisito {
  id?: number;
  idMateria: number;
  idMateriaReq: number;
  materia?: Materia;
  materiaRequisito?: Materia;
}

@Injectable({
  providedIn: 'root'
})
export class PrerrequisitoService {
  private apiUrl = `${environment.apiUrl}/prerrequisitos`;

  constructor(private http: HttpClient) { }

  // GET todos los prerrequisitos
  getPrerrequisitos(): Observable<Prerrequisito[]> {
    return this.http.get<Prerrequisito[]>(this.apiUrl);
  }

  // POST nuevo prerrequisito
  createPrerrequisito(prerrequisito: Prerrequisito): Observable<Prerrequisito> {
    return this.http.post<Prerrequisito>(this.apiUrl, prerrequisito);
  }

  // DELETE prerrequisito
  deletePrerrequisito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
