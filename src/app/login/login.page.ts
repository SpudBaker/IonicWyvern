import { Component, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail,signInWithEmailAndPassword, sendEmailVerification,signOut, user, User } from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnDestroy {

  public user$: Observable<User | null>;
  private userSubscription: Subscription;
  public loginErrMessage: string;
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

  login(){
    this.loginErrMessage = null;
    signInWithEmailAndPassword(this.auth, this.inputEmail, this.inputPassword).catch(e => {
      let err = e as FirebaseError;
      switch (err.code){
        case('auth/user-not-found'):
          this.loginErrMessage = 'email not recognised, have you registered?';
          return;
        case ('auth/wrong-password'):
          this.loginErrMessage = 'wrong password - please try again or reset';
          return;
        case ('auth/too-many-requests'):
          this.loginErrMessage = 'too many attempts and account is locked. Please reset password.';
          return;
      }
    });
  }

  async resetPassword(){
    this.loginErrMessage = null;
    if (!this.inputEmail){
      this.loginErrMessage = 'Please enter an email address to reset your password';
      return;
    }
    await sendPasswordResetEmail(this.auth, this.inputEmail)
    .then(() => this.loginErrMessage = 'Please check your inbox for an email with a password reset link')
    .catch(err => {
      switch (err.code){
        case ('auth/invalid-email'):
          this.loginErrMessage = 'Please enter the correct email format';
      };
    });
  }

  logOut(){
    signOut(this.auth);
  }

  register(){
    this.loginErrMessage = null;
    if ((!this.inputEmail) || (!this.inputPassword)){
      this.loginErrMessage = 'Please enter an email address and password to register an account';
      return;
    }
    createUserWithEmailAndPassword(this.auth, this.inputEmail, this.inputPassword)
    .then(err => this.loginErrMessage = err.toString())
    .catch(err => {
      switch (err.code){
        case ('auth/invalid-email'):
          this.loginErrMessage = 'Please enter the correct email format';
      };
    });
  }

}
