import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { MenuComponent } from './menu/menu.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: 'player', component: PlayerComponent },
  { path: '', component: MenuComponent },
  { path: 'game', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
