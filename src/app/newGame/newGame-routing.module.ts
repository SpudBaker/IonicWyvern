import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewGamePage } from './newGame.page';

const routes: Routes = [
  {
    path: '',
    component: NewGamePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class newGamePageRoutingModule {}
