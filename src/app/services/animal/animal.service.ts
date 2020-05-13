import {Injectable} from '@angular/core';
import {Breed} from 'src/app/interfaces/animal/breed';
import {Temper} from 'src/app/interfaces/animal/temper';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CreateAnimal} from 'src/app/interfaces/animal/create-animal';
import { UpdateAnimal } from 'src/app/interfaces/animal/update-animal';
import { AnimalInterface } from 'src/app/interfaces/animal/animal-interface';

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

    updateAnimal(updateAnimal: UpdateAnimal): Observable<any> {
        return this.http.put<any>(environment.BACKEND_URL + '/api/animal/update', updateAnimal);
    }

    getAnimalTemper(): Observable<Temper[]> {
        return this.http.get<Temper[]>(environment.BACKEND_URL + '/api/animal/tempers');
    }

    getAnimalBreed(): Observable<Breed[]> {
        return this.http.get<Breed[]>(environment.BACKEND_URL + '/api/animal/breeds');
    }

    //TODO recup info de l'animal dans le back à revoir 
    public getAnimalById(animalId: number): Observable<AnimalInterface> {

        const params: HttpParams = new HttpParams().set('animalId', animalId.toString());
        return this.http.get<AnimalInterface>(environment.BACKEND_URL + '/api/animal', {params});
    }

}
