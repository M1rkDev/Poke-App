import { IPokemon } from './../interfaces/ipokemons';
import { environment } from 'src/environments/environment';
export class Pokemon{
  name: string;
  img: string;
  id: number;
  constructor(pokData: IPokemon){
    this.name = pokData.name;
    const pieces = pokData.url.split('/');
        this.id = +pieces[pieces.length - 2];
        this.img = environment.pokImgUrl + this.id + '.png';
  }
}
