import {Injectable} from '@angular/core';
import {Breed} from 'src/app/interfaces/animal/breed';
import {Temper} from 'src/app/interfaces/animal/temper';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CreateAnimal} from 'src/app/interfaces/animal/create-animal';

@Injectable({
    providedIn: 'root'
})
export class AnimalService {

    constructor(
        private http: HttpClient
    ) {
    }

    createAnimal(createAnimal: CreateAnimal): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/animal/create', createAnimal);
    }

    getAnimalTemper(): Observable<Temper[]> {
        return this.http.get<Temper[]>(environment.BACKEND_URL + '/api/animal/tempers');
    }

    getAnimalBreed(): Observable<Breed[]> {
        return this.http.get<Breed[]>(environment.BACKEND_URL + '/api/animal/breeds');
    }
}
