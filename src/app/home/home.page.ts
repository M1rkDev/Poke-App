/* eslint-disable @typescript-eslint/member-ordering */
import { Observable } from 'rxjs';
import { IPokemon } from './../interfaces/ipokemons';
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/dot-notation */
import { PokemonApiService } from './../services/pokemon-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Pokemon } from '../models/pokemon';
import { IonList, LoadingController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: Observable <Pokemon[]>;
  private loading: any
  public pageTitle = 'POKEMONS';
  public isFavoritePage = false;
  public favorites: Pokemon[];
  @ViewChild(IonList) pokList: IonList;

  constructor(public pokService: PokemonApiService, private loadingCtrl: LoadingController, private toast: ToastController) { }

  async ngOnInit() {
   this.loading = await this.presentLoading();
   this.favorites = await (await this.pokService.getFavoritePokemon('')).toPromise()
   console.log(this.favorites)
   await this.loading.present();
   this.pokemons = this.pokService.getPokemons('');
   this.pokemons.subscribe( () => { this.loading.dismiss()});
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000,
      position: 'middle',
      color,
      animated: true
    });
    await toast.present();
  }

  public isPokFavorite(pok: Pokemon){
    const poks = this.favorites.filter(fPok => fPok.name === pok.name);
    return poks.length > 0;
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Caricamento...'
    });
    return loading;
  }

  filterPokemons($event){
    this.pokemons = this.pokService.getPokemons($event.target.value);
  }

 async favorite(pok: Pokemon, element){
   const isFav =  this.isPokFavorite(pok);
    const result = await this.pokService.addPokemonToFavorite(pok, isFav);
    this.favorites = await (await this.pokService.getFavoritePokemon('')).toPromise()
    let item;
    if(element.target.nodeName.toUpperCase() === 'ION-ICON'){
      item = element.target.parentNode;
    } else {
      item = element.target;
    }

    if(!isFav && result){
      item.color = 'danger';
     await this.presentToast(pok.name + ' Aggiunto ai preferiti', 'danger');
    } else {
      item.color = 'primary'
     await this.presentToast(pok.name + ' Rimosso da i preferiti', 'primary');
    }
    await this.pokList.closeSlidingItems();
  }

  share(pok: Pokemon){

  }

}
