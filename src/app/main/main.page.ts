import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WyvernService } from '../service/wyvern.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})

export class MainPage{

  public $checkForActiveGamePending: Observable<string[]>;
  public $checkForActiveGameInProgress: Observable<string[]>;


  constructor(private router: Router, private wyvern: WyvernService) {
    this.$checkForActiveGamePending = this.wyvern.checkForActiveGamePending();
    this.$checkForActiveGameInProgress = this.wyvern.checkForActiveGameInProgress();

  }

  newGame(){
    this.router.navigate(['newGame']);
  }

}
