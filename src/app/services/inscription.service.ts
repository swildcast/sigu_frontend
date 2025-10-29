import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Inscription {
  id?: number;
  name: string;
  email: string;
  program: string;
  inscriptionDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = `${environment.apiUrl}/Inscription`;

  constructor(private http: HttpClient) { }

  // GET todas las inscripciones
  getInscriptions(): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(this.apiUrl);
  }

  // GET inscripción por ID
  getInscription(id: number): Observable<Inscription> {
    return this.http.get<Inscription>(`${this.apiUrl}/${id}`);
  }

  // POST nueva inscripción
  createInscription(inscription: Inscription): Observable<Inscription> {
    return this.http.post<Inscription>(this.apiUrl, inscription);
  }

  // PUT actualizar inscripción
  updateInscription(id: number, inscription: Inscription): Observable<Inscription> {
    return this.http.put<Inscription>(`${this.apiUrl}/${id}`, inscription);
  }

  // DELETE inscripción
  deleteInscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}