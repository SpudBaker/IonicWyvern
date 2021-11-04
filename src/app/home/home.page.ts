import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private db: AngularFirestore) {
    this.db.doc('/foo/foo').snapshotChanges().subscribe(snap => {
      console.log(snap.payload.data());
    });
  }

}
