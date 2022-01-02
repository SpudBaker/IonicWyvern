import { Component } from '@angular/core';
import { WyvernService } from '../service/wyvern.service';


@Component({
  selector: 'app-playGame',
  templateUrl: 'playGame.page.html',
  styleUrls: ['playGame.page.scss'],
})
export class PlayGamePage {

  constructor(private wyvernService: WyvernService) {
  }

}
