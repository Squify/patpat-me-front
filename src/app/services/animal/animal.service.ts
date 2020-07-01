import { Injectable } from '@angular/core';
import { Breed } from 'src/app/interfaces/animal/breed';
import { Temper } from 'src/app/interfaces/animal/temper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateAnimal } from 'src/app/interfaces/animal/create-animal';
import { UpdateAnimal } from 'src/app/interfaces/animal/update-animal';
import { Animal } from '../../interfaces/animal/animal';

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
        return this.http.post<any>(environment.BACKEND_URL + '/api/animal/update', updateAnimal);
    }

    getAnimalTemper(): Observable<Temper[]> {
        return this.http.get<Temper[]>(environment.BACKEND_URL + '/api/animal/tempers');
    }

    getAnimalBreed(): Observable<Breed[]> {
        return this.http.get<Breed[]>(environment.BACKEND_URL + '/api/animal/breeds');
    }

    public getAnimalById(animalId: number): Observable<Animal> {
        const params: HttpParams = new HttpParams().set('animalId', animalId.toString());
        return this.http.get<Animal>(environment.BACKEND_URL + '/api/animal', {params});
    }

    deleteAnimal(animalId: number) {
        const params: HttpParams = new HttpParams().set('animalId', animalId.toString());
        return this.http.delete<any>(environment.BACKEND_URL + '/api/animal/delete', {params})
    }

    loadCatPics(): string[] {
        let catPicPaths = [];
        for (let i = 1; i <= 8; i++) {
            catPicPaths.push('/assets/images/cat_pic/cat_' + i + '.png')
        }
        return catPicPaths;
    }

    loadDogPics(): string[] {
        let dogPicPaths = [];
        for (let i = 1; i <= 8; i++) {
            dogPicPaths.push('/assets/images/dog_pic/dog_' + i + '.png')
        }
        return dogPicPaths;
    }
}
