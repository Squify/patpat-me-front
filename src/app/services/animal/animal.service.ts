import { Injectable } from '@angular/core';
import { AnimalRace } from 'src/app/interfaces/animal-race';
import { AnimalTemper } from 'src/app/interfaces/animal-temper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  races: AnimalRace[];
  tempers: AnimalTemper[];

  constructor(
      private http: HttpClient
  ) {
  }

  getAnimalTemper(): Observable<AnimalTemper[]> {
    return this.http.get<AnimalTemper[]>(environment.BACKEND_URL + '/api/animal/tempers');
}
  getAnimalRace(): Observable<AnimalRace[]> {
      return this.http.get<AnimalRace[]>(environment.BACKEND_URL + '/api/animal/races');
  }
}
