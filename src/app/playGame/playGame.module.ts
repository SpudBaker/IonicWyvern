import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PlayGamePage } from './playGame.page';
import { HeaderComponent } from '../components/header/header.component';
import { PlayGamePageRoutingModule } from './playGame-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayGamePageRoutingModule
  ],
  declarations: [HeaderComponent, PlayGamePage]
})
export class PlayGamePageModule {}
