import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';


//import { AngularFireDatabase } from '@angular/fire/database';
//import { Observable } from 'rxjs/Observable';
import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';

import { SocialSharing } from '@ionic-native/social-sharing';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: ['home.scss']
})
export class HomePage {
  hayMas:boolean = true;
  //posts: Observable<any[]>;
 /* constructor(public modalCtrl: ModalController,
               afDB: AngularFireDatabase) {
   
     this.posts = afDB.list('post').valueChanges();
  }*/
  constructor(public modalCtrl: ModalController,
              public _cap:CargaArchivoProvider,
              private socialSharing: SocialSharing){

  }

  mostrar_modal(){
      let modal = this.modalCtrl.create(SubirPage);

      modal.present();
  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this._cap.cargar_imagenes().then(
      (hayMas:boolean)=>{
        this.hayMas = hayMas;
        infiniteScroll.complete()
      }
    );
     
  }
  facebookShare(post:any) {
    this.socialSharing.shareViaFacebook(post.titulo,post.img,post.img)
          .then(()=>{}) // se pudo compartir
          .catch(()=>{}); // si sucede un error
    
  }


}
