import { PokemonApiService } from './../services/pokemon-api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon';

@Component({
  selector: 'app-favorite',
  templateUrl: '../home/home.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  pokemons:  Observable <Pokemon[]>;
  public pageTitle = 'POKEMONS PREFERITI';
  public isFavoritePage = true;
  constructor(private pokService: PokemonApiService) { }

  ngOnInit() {
  }

  public isPokFavorite(pok: Pokemon){

  }

  async populateFavorite(){
    this.pokemons = await this.pokService.getFavoritePokemon('');
  }

  async ionViewWillEnter(){
   await this.populateFavorite();
  }

  async filterPokemons($event){
    this.pokemons = await this.pokService.getFavoritePokemon($event.target.value);
  }

  async favorite(pok: Pokemon, element){
    const result = await this.pokService.addPokemonToFavorite(pok, true);
    this.populateFavorite();
    this.pokemons.subscribe();
  }

  share(pok: Pokemon){

  }

}
