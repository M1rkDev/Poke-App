import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'pokemons',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorite/favorite.module').then(m => m.FavoritePageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../contact/contact.module').then(m => m.ContactPageModule)
      },
      {
        path: '',
        redirectTo: '/pokemons/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pokemons/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
