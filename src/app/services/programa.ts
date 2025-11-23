import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Programa {
  id?: number;
  name: string;
  description: string;
  duration: number; // en años
}

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  private apiUrl = `${environment.apiUrl}/programas`;

  constructor(private http: HttpClient) { }

  // GET todos los programas
  getProgramas(): Observable<Programa[]> {
    return this.http.get<Programa[]>(this.apiUrl);
  }

  // POST nuevo programa
  createPrograma(programa: Programa): Observable<Programa> {
    return this.http.post<Programa>(this.apiUrl, programa);
  }

  // PUT actualizar programa
  updatePrograma(id: number, programa: Programa): Observable<Programa> {
    return this.http.put<Programa>(`${this.apiUrl}/${id}`, programa);
  }

  // DELETE programa
  deletePrograma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
