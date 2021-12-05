import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut, user, User } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as Globals from '../../globals';
import { addDoc, collection, doc, DocumentData, DocumentReference, Firestore, getDocs, getFirestore, query, runTransaction, where  } from '@angular/fire/firestore';

@Component({
  selector: 'app-newGame',
  templateUrl: 'newGame.page.html',
  styleUrls: ['newGame.page.scss'],
})
export class NewGamePage implements OnDestroy {

  public user$: Observable<User | null>;
  private userSubscription: Subscription;
  public EdgeState = Globals.EdgeState;
  public gameModel = new Globals.GameModel();
  public Orientation = Globals.Orientation;

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

  edgeClick(orientation: Globals.Orientation, h:number, v: number){
    switch (orientation){
      case this.Orientation.Horizontal: {
        switch(this.gameModel.horizontalEdges[h][v]) {
          case this.EdgeState.Unknown: {
            this.gameModel.horizontalEdges[h][v] = this.EdgeState.Wall;
            this.checkIfValidRouteExists();
            break;
          }
          case this.EdgeState.Wall:
            this.gameModel.horizontalEdges[h][v] = this.EdgeState.Unknown;
            this.checkIfValidRouteExists();
            break;
          }
        }
        break;
      case this.Orientation.Vertical:{
        switch(this.gameModel.verticalEdges[h][v]) {
          case this.EdgeState.Unknown: {
            this.gameModel.verticalEdges[h][v] = this.EdgeState.Wall;
            this.checkIfValidRouteExists();
            break;
          }
          case Globals.EdgeState.Wall:
            this.gameModel.verticalEdges[h][v] = this.EdgeState.Unknown;
            this.checkIfValidRouteExists();
            break;
          }
        }
        break;
      }
  }

  squareClick(h:number, v: number){
    this.gameModel.target.horizontal = h;
    this.gameModel.target.vertical = v;
    this.checkIfValidRouteExists();
  }

  getCornerState(h: number, v:number): string {
    try{
      if(this.gameModel.horizontalEdges[h][v] === this.EdgeState.Wall) { 
        return Globals.EdgeState.Border
      } 
    } catch {}
    try{
      if(this.gameModel.horizontalEdges[h-1][v] === this.EdgeState.Wall) { 
        return Globals.EdgeState.Border
      }
    } catch {}
    try{
      if(this.gameModel.verticalEdges[h][v] === this.EdgeState.Wall) { 
        return Globals.EdgeState.Border
      }
    } catch {}
    try{
      if(this.gameModel.verticalEdges[h][v-1] === this.EdgeState.Wall) { 
        return Globals.EdgeState.Border
      }
    } catch {}
    return Globals.EdgeState.Unknown;
  }

  checkIfValidRouteExists() {
    this.gameModel.validRouteExists = false;
    for(let h = 0; h < 6; h++ ) {
      for(let v = 0; v < 6; v++ ) {  
        this.gameModel.squares[h][v] = Globals.SquareState.Unknown;
        this.gameModel.squares[0][0] = Globals.SquareState.ReachableNotChecked;
      }
    }
    let count = 1;
    while ((count > 0) && (!this.hasTargetBeenFound())) {
      count = 0;
      for(let h = 0; h < 6; h++ ) {
        for(let v = 0; v < 6; v++ ) {   
          if (this.gameModel.squares[h][v] === Globals.SquareState.ReachableNotChecked) {
            this.gameModel.squares[h][v] = Globals.SquareState.ReachableChecked;
            count = count + this.checkForAdjacentSquares(h, v);
          }
        }
      }
    }
  }

  checkForAdjacentSquares(h: number, v: number): number {
    let counter = 0
    if (v > 0) {
      if (this.gameModel.squares[h][v-1] === Globals.SquareState.Unknown 
            && this.gameModel.horizontalEdges[h][v] !== this.EdgeState.Wall 
            && this.gameModel.horizontalEdges[h][v] !== this.EdgeState.Border ){
        this.gameModel.squares[h][v-1] = Globals.SquareState.ReachableNotChecked;
        counter ++;
      }
    }
    if (h > 0) {  
      if (this.gameModel.squares[h-1][v] === Globals.SquareState.Unknown
            && this.gameModel.verticalEdges[h][v] !== this.EdgeState.Wall 
            && this.gameModel.verticalEdges[h][v] !== this.EdgeState.Border ) {
        this.gameModel.squares[h-1][v] = Globals.SquareState.ReachableNotChecked;
        counter ++;
      }
    }
    if (v < 5) {
      if (this.gameModel.squares[h][v+1] === Globals.SquareState.Unknown
            && this.gameModel.horizontalEdges[h][v+1] !== this.EdgeState.Wall 
            && this.gameModel.horizontalEdges[h][v+1] !== this.EdgeState.Border ) {
        this.gameModel.squares[h][v+1] = Globals.SquareState.ReachableNotChecked;
        counter ++;
      }
    }
    if (h < 5) {
      if (this.gameModel.squares[h+1][v] === Globals.SquareState.Unknown
            && this.gameModel.verticalEdges[h+1][v] !== this.EdgeState.Wall 
            && this.gameModel.verticalEdges[h+1][v] !== this.EdgeState.Border
        ) {
        this.gameModel.squares[h+1][v] = Globals.SquareState.ReachableNotChecked;
        counter ++;
      }
    }
    return counter;
  }

  hasTargetBeenFound(): boolean {
    switch (this.gameModel.squares[this.gameModel.target.horizontal][this.gameModel.target.vertical]) {
      case Globals.SquareState.ReachableChecked:
      case Globals.SquareState.ReachableNotChecked: {
        this.gameModel.validRouteExists = true;
        return true;
      }
    }
    return false;
  }

  async continue() {
    const gamesCollection = collection(getFirestore(), "games");
    let matchedDoc: DocumentReference;
    let matchedUserEmail: string;
    const user = await this.user$.pipe(take(1)).toPromise();
    const q = query(collection(getFirestore(), "games"), where("gameState", "==", Globals.GameState.WAITING_FOR_PLAYERS));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      if (doc.get('player1') != user.email){
        matchedDoc = doc.ref;
        matchedUserEmail = doc.get('player1');
      }
    });
    if (!matchedDoc){
      alert('adding new doc');
      addDoc( gamesCollection, {
        player1: user.email,
        player1Board: JSON.stringify(this.gameModel),
        gameState: Globals.GameState.WAITING_FOR_PLAYERS
        }
      ).catch(err => alert(err));
    } else {
      await runTransaction(getFirestore(), async (transaction) => {
        const sfDoc = await transaction.get(matchedDoc);
        if (!sfDoc.exists()) {
          alert("Document does not exist!");
        } else {
          if (sfDoc.get('gameState')===Globals.GameState.WAITING_FOR_PLAYERS) {
            transaction.update(matchedDoc, { player2: user.email });
            transaction.update(matchedDoc, { player2Board: JSON.stringify(this.gameModel)});
            transaction.update(matchedDoc, { gameState: Globals.GameState.IN_PROGRES });
            alert('game : ' + sfDoc.id +  ' -----  player1 = ' + matchedUserEmail);
          } else {
            alert("Status of document has changed - new game created");
            addDoc( gamesCollection, {
              player1: user.email,
              player1Board: JSON.stringify(this.gameModel),
              gameState: Globals.GameState.WAITING_FOR_PLAYERS
              }
            ).catch(err => alert(err));
        }}
        }).catch(err => alert(err));
    }
  }
}
