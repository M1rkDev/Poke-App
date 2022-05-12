/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { IResult, IPokemonData } from './../interfaces/ipokemons';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPokemon } from '../interfaces/ipokemons';
import { switchMap, tap, map } from 'rxjs/operators';
import { from, merge, Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { Storage } from '@ionic/storage-angular';

const POKEMON_KEY = 'pokemons';
const POKEMON_FAVORITE = 'pokemons-favorite';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {
  private _storage: Storage | null = null;

  constructor(public http: HttpClient, private storage: Storage) { this.init(); }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    // eslint-disable-next-line no-underscore-dangle
    this._storage = storage;
  }

  getPokemons(pokemonName: string): Observable<Pokemon[]> {

    const url = environment.pokUrl + '?limit=' + environment.limit;

    const cacheData = from(this.storage.get(POKEMON_KEY));
           cacheData.subscribe(res =>{
           });
    return merge(cacheData,this.http.get<IResult>(url))
    .pipe(

      map((res:IResult) =>{
        if(!res){
          return [];
        }
        this.storage.set(POKEMON_KEY,res);
        if(pokemonName.length > 0){
          res.results = res.results.filter(p => p.name.startsWith(pokemonName));
        }
         return res.results.map(ress => new Pokemon(ress));

     }),
      tap((res:Pokemon[]) => (res))
      );

 }

  getPokemonData(id: number):Observable<IPokemonData>{
    const url = environment.pokUrl + '/' + id + '/';
    return this.http.get<IPokemonData>(url);
  }

  async addPokemonToFavorite(pok: Pokemon, isFavorite: boolean){
    let data: Pokemon[] = await this.storage.get(POKEMON_FAVORITE) ?? [];
    if(!isFavorite && data.some((res) => res.id === pok.id)){
      return;
    }
    if(!isFavorite){
      data.push(pok);
    } else{
      data = data.filter(res => res.id !== pok.id);
    }

    return await this.storage.set(POKEMON_FAVORITE, data);
  }

  async getFavoritePokemon(pokeName: string): Promise<Observable<Pokemon[]>>{
    return from(this.storage.get(POKEMON_FAVORITE)).pipe(
      map((res:Pokemon[]) =>{
        if(!res || !res.length){
          return [];
        }
        if(pokeName){
          return res.filter(pok => pok.name.startsWith(pokeName));
        }
        return res;
      })
    );
  }

  async isPokemonFavorite(pok: Pokemon){
    let data: Pokemon[] = await this.storage.get(POKEMON_FAVORITE) ?? [];
    if(data.length === 0){
      return false;
    }
    if(data.some((res) => +res.id === +pok.id)){
      return true;
    }

    return false;
  }
}


