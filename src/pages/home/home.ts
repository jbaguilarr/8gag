import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';


import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: ['home.scss']
})
export class HomePage {
  items: Observable<any[]>;
  constructor(public modalCtrl: ModalController,
               afDB: AngularFireDatabase) {
   
     this.items = afDB.list('post').valueChanges();
  }

  mostrar_modal(){
      let modal = this.modalCtrl.create(SubirPage);

      modal.present();
  }

}
