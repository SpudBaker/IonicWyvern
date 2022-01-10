import { Injectable } from '@angular/core';
import { addDoc, collection, DocumentReference, getDocs, getFirestore, query, runTransaction, where } from '@angular/fire/firestore';
import { Auth, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as Globals from '../../globals';
import { Observable } from 'rxjs';

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

  checkForActiveGameInProgress(): Observable<string[]>{
    return user(this.auth).pipe(
      first(),
      filter(data => !((data == null) || (data.email == null))),
      map(data => {
        return data.email;
      }),
      switchMap(email => {
        const q = query(collection(getFirestore(), "games"), 
          where("gameState", "==", Globals.GameState.IN_PROGRESS),
          where("player1","==", email));
        return getDocs(q);
      }),
      map(querySnapShot => {
        const arrString : string[] = [];
        if (querySnapShot.size > 0) {
         querySnapShot.forEach(item => {
           arrString.push(item.id);
         })
        }
        console.log('checkForActiveGameInProgress()');
        return arrString;
      })
    )
  }

  checkForActiveGamePending(): Observable<string[]>{
    return user(this.auth).pipe(
      first(),
      filter(data => !((data == null) || (data.email == null))),
      map(data => {
        return data.email;
      }),
      switchMap(email => {
        const q = query(collection(getFirestore(), "games"), 
          where("gameState", "==", Globals.GameState.WAITING_FOR_PLAYERS),
          where("player1","==", email));
        return getDocs(q);
      }),
      map(querySnapShot => {
        const arrString : string[] = [];
        if (querySnapShot.size > 0) {
         querySnapShot.forEach(item => {
           arrString.push(item.id);
         })
        }
        return arrString;
      })
    )
  }

  async createNewGame(gameModel: Globals.GameModel){
    const gamesCollection = collection(getFirestore(), "games");
    let matchedDoc: DocumentReference;
    let matchedUserEmail: string;
    const u = await user(this.auth).pipe(first()).toPromise();
    const q = query(collection(getFirestore(), "games"), where("gameState", "==", Globals.GameState.WAITING_FOR_PLAYERS));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      if (doc.get('player1') != u.email){
        matchedDoc = doc.ref;
        matchedUserEmail = doc.get('player1');
      }
    });
    if (!matchedDoc){
      alert('adding new doc');
      addDoc( gamesCollection, {
        player1: u.email,
        player1Board: JSON.stringify(gameModel),
        gameState: Globals.GameState.WAITING_FOR_PLAYERS
        }
      )
      .then(() => this.router.navigate(['playGame']))
      .catch(err => alert(err))
    } else {
      await runTransaction(getFirestore(), async (transaction) => {
        const sfDoc = await transaction.get(matchedDoc);
        if (!sfDoc.exists()) {
          alert("Document does not exist!");
        } else {
          if (sfDoc.get('gameState')===Globals.GameState.WAITING_FOR_PLAYERS) {
            try{
              alert('game : ' + sfDoc.id +  ' -----  player1 = ' + matchedUserEmail);
              transaction.update(matchedDoc, { player2: u.email });
              transaction.update(matchedDoc, { player2Board: JSON.stringify(gameModel)});
              transaction.update(matchedDoc, { gameState: Globals.GameState.IN_PROGRESS });
              this.router.navigate(['playGame']);
            }catch(err) {
              alert(err);
            }
          } else {
            alert("Status of document has changed - new game created");
            addDoc( gamesCollection, {
              player1: u.email,
              player1Board: JSON.stringify(gameModel),
              gameState: Globals.GameState.WAITING_FOR_PLAYERS
              }
            )
            .then(() => this.router.navigate(['playGame']))
            .catch(err => alert(err))
          }
        }
      }).catch(err => alert(err));
    }
  }

}
