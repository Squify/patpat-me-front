import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import { AnimalType } from 'src/app/interfaces/animal-type';


@Injectable({
  providedIn: 'root'
})
export class TypeService {

  types: AnimalType[];

  constructor(
      private http: HttpClient
  ) {
  }

  getAnimalType(): Observable<AnimalType[]> {
      return this.http.get<AnimalType[]>(environment.BACKEND_URL + '/api/animal/type');
  }
}
