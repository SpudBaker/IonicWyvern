import { Component, OnDestroy } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnDestroy {

  private user$: Observable<User | null>;
  private userSubscription: Subscription;
  public inputEmail: string;
  public inputPassword: string;
  public initialised = false;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
    this.userSubscription = this.user$.subscribe(data => {
      console.log(data);
      this.initialised = true;
    });
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  async login(){
    signInWithEmailAndPassword(this.auth, this.inputEmail, this.inputPassword);
  }

  logOut(){
    signOut(this.auth);
  }

  newUser(){
  }

}
