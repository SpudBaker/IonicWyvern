import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WyvernService } from '../service/wyvern.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})

export class MainPage{

  private pendingChecked = false;
  public pendingGames : string[] = [];
  private inProgressChecked = false;
  public inProgressGames : string[] = [];

  constructor(private router: Router, private wyvern: WyvernService) {
    this.wyvern.checkForActiveGamePending()
    .pipe(
      tap(() => this.pendingChecked = true),
      tap(res => this.pendingGames = res)
    ).subscribe();
    this.wyvern.checkForActiveGameInProgress()
    .pipe(
      tap(() => this.inProgressChecked = true),
      tap(res => this.inProgressGames = res)
    ).subscribe();
  }

  initiated(): boolean {
    return (this.pendingChecked && this.inProgressChecked);
  }

  newGame(){
    this.router.navigate(['newGame']);
  }

}
