import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut, user, User } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnDestroy {

  public user$: Observable<User | null>;
  private userSubscription: Subscription;

  constructor(private auth: Auth, private router: Router) {
    this.user$ = user(this.auth);
    this.userSubscription = this.user$.subscribe(data => {
      if (data == null) {
        this.router.navigate(['login']);
      }
    });
  }

  logOut(){
    signOut(this.auth);
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

}
