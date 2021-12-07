import { Component,  OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Auth, signOut, user, User } from '@angular/fire/auth';
import { Firestore  } from '@angular/fire/firestore';


@Component({
  selector: 'app-playGame',
  templateUrl: 'playGame.page.html',
  styleUrls: ['playGame.page.scss'],
})
export class PlayGamePage implements OnDestroy{

  public user$: Observable<User | null>;
  private userSubscription: Subscription;

  constructor(private afs: Firestore, private auth: Auth, private router: Router) {
    this.user$ = user(this.auth);
    this.userSubscription = this.user$.subscribe(data => {
      if (data == null) {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  logOut(){
    signOut(this.auth);
  }

}
