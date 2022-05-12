/* eslint-disable @typescript-eslint/member-ordering */
import { LoadingController } from '@ionic/angular';
import { PokemonApiService } from './../services/pokemon-api.service';
/* eslint-disable no-trailing-spaces */
import { Observable } from 'rxjs';
import { IPokemon, IPokemonData } from './../interfaces/ipokemons';
import { Pokemon } from './../models/pokemon';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.page.html',
  styleUrls: ['./pokemon-details.page.scss'],
})
export class PokemonDetailsPage implements OnInit {
  public pokemon: Pokemon;
  public pokemonData: Observable<IPokemonData>;
  private id: number;
  isFavorite: boolean;

  constructor(private router: ActivatedRoute, private pokService: PokemonApiService, private loadingCtrl: LoadingController,
     private route: Router) { }
  ngOnInit(): void {

  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      message: 'Caricamento...'
    });
    await loading.present();

    const id = +this.router.snapshot.paramMap.get('id');
    this.id =id;

    const name = this.router.snapshot.queryParamMap.get('name');
    this.pokemon = new Pokemon({name, url: environment.pokImgUrl + '/' + id + '/'});

    this.isFavorite = await this.pokService.isPokemonFavorite(this.pokemon);

    this.pokemonData = this.pokService.getPokemonData(id);
    this.pokemonData.subscribe(()=> loading.dismiss());
  }

  async addToFavorite(){
    const result = await this.pokService.addPokemonToFavorite(this.pokemon, this.isFavorite);
    this.route.navigate(['pokemons/favorites']);
  }

  share(){

  }

}
