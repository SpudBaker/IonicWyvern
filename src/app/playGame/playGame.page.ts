import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Auth, signOut, user, User } from '@angular/fire/auth';
import { Firestore  } from '@angular/fire/firestore';


@Component({
  selector: 'app-playGame',
  templateUrl: 'playGame.page.html',
  styleUrls: ['playGame.page.scss'],
})
export class PlayGamePage {

  constructor(private afs: Firestore, private auth: Auth, private router: Router) {
    user(this.auth).pipe(first()).subscribe(data => {
      if (data == null) {
        this.router.navigate(['login']);
      }
    });
  }

  logOut(){
    signOut(this.auth);
  }

}
