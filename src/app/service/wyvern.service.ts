import { Injectable } from '@angular/core';
import { addDoc, collection, DocumentReference, getDocs, getFirestore, query, runTransaction, where  } from '@angular/fire/firestore';
import { Auth, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as Globals from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class WyvernService {

  constructor(private auth: Auth, private router: Router) {
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
