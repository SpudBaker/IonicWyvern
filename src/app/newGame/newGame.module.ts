import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NewGamePage } from './newGame.page';

import { newGamePageRoutingModule } from './newGame-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    newGamePageRoutingModule
  ],
  declarations: [NewGamePage]
})
export class NewGamePageModule {}
