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

  submit(){
    this.loginErrMessage = null;
    if ((!this.inputEmail) || (!this.inputPassword)){
      this.loginErrMessage = 'Enter both email and password';
      return;
    }
    signInWithEmailAndPassword(this.auth, this.inputEmail, this.inputPassword).catch(e => {
      let err = e as FirebaseError;
      switch (err.code){
        case ('auth/invalid-email'):
          this.loginErrMessage = 'Enter the correct email format';
          break;
        case('auth/user-not-found'):
          this.register();
          break;
        case ('auth/wrong-password'):
          this.loginErrMessage = 'Wrong password - try again or reset';
          break;
        case ('auth/too-many-requests'):
          this.loginErrMessage = 'Too many attempts and account is locked. Reset password.';
          break;
        default:
          this.loginErrMessage = err.code;
      }
    });
  }

  async resetPassword(){
    this.loginErrMessage = null;
    if (!this.inputEmail){
      this.loginErrMessage = 'Enter an email to reset your password';
      return;
    }
    await sendPasswordResetEmail(this.auth, this.inputEmail)
    .then(() => this.loginErrMessage = 'Check your inbox for an email with a password reset link')
    .catch(err => {
      switch (err.code){
        case ('auth/invalid-email'):
          this.loginErrMessage = 'Enter the correct email format';
        default:
          this.loginErrMessage = err.code;
      };
    });
  }

  logOut(){
    signOut(this.auth);
  }

  register(){
    this.loginErrMessage = null;
    createUserWithEmailAndPassword(this.auth, this.inputEmail, this.inputPassword)
    .then(err => this.loginErrMessage = err.toString())
    .catch(err => {
      switch (err.code){
        case ('auth/invalid-email'):
          this.loginErrMessage = 'Enter the correct email format';
          break;
        case ('auth/email-already-in-use'):
          this.loginErrMessage = 'Email address is alreday registered';
          break;
        case ('auth/weak-password'):
          this.loginErrMessage = 'Create a stronger password when registering';
          break;
        default:
          this.loginErrMessage = err.code;
      };
    });
  }

  proceed(){
    
  }

}
