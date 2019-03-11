import { Injectable } from '@angular/core';

import { ToastController } from 'ionic-angular';

import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase';

import 'rxjs/add/operator/map';

@Injectable()
export class CargaArchivoProvider {

  imagenes:ArchivoSubir[] = [];
  lastKey:string = null;

  constructor(public toastCtrl: ToastController,
              public afDb:AngularFireDatabase) {
   // console.log('Hello CargaArchivoProvider Provider');
      this.cargar_ultimo_key()
          .subscribe(()=>{
             this.cargar_imagenes();
          });
  }

 private cargar_ultimo_key(){
   return  this.afDb.list('/post',ref=> ref.orderByKey().limitToLast(1))
            .valueChanges()
            .map((post:any)=>{
                 this.lastKey = post[0].key;
                 this.imagenes.push(post[0]);
            });
  }
  cargar_imagenes(){
      let promesa = new Promise((resolve,reject)=>{
          this.afDb.list('/post',
            ref => ref.limitToLast(3)
                      .orderByKey()
                      .endAt(this.lastKey)
          ).valueChanges()
            .subscribe((posts:any)=>{
                posts.pop();
                if(posts.length == 0){
                  console.log('Ya no hay mas registro');
                  resolve(false);
                  return;
                }

                this.lastKey = posts[0].key;
                for(let i = posts.length-1; i >=0; i--){
                  let post = posts[i];
                  this.imagenes.push(post);
                }

                resolve(true);
            });
      });
      return promesa;
  }
  cargar_imagen_firebase(archivo:ArchivoSubir){
      let promesa = new Promise((resolve,reject)=>{
          this.mostrar_toast('Cargando......');

          let storeRef = firebase.storage().ref();
          let nombreArchivo:string = new Date().valueOf().toString();

          // storeRef.child(`img/${ nombreArchivo}`)
          let uploadTask: firebase.storage.UploadTask = 
              storeRef.child(`${ nombreArchivo}.jpg`)
                      .putString( archivo.img, 'base64', { contentType: 'image/jpeg'});

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                ()=>{},// saber el % de cuantos Mbs se han subidos
                (error)=>{
                  // manejo de error
                  console.log("ERROR EN LA CARGA");
                  console.log(JSON.stringify(error));
                  this.mostrar_toast(JSON.stringify(error));
                  reject();
                },
                ()=>{
                    // TODO BIEN
                    console.log("Archivo subido");

                   // this.mostrar_toast("Imagen Cargada correctamente");
                    
                   // let url = uploadTask.snapshot.downloadURL;
                  //  this.crear_post(archivo.titulo,url,nombreArchivo);

                  uploadTask.snapshot.ref.getDownloadURL().then((dowloadURL)=>{
                     console.log('file avaliable at',dowloadURL);
                     let url = dowloadURL;
                     this.crear_post(archivo.titulo,url,nombreArchivo);
                     resolve();
                  });

                    
                }      
            
            );

      });

      return promesa;
  }
  
  crear_post(titulo:string, url:string, nombreArchivo:string){
      let post:ArchivoSubir = {
        img: url,
        titulo: titulo,
        key: nombreArchivo
      }
      console.log(JSON.stringify(post));
      //this.afDb.list('/post').push(post)
      this.afDb.object(`/post/${nombreArchivo}`).update(post);

      this.imagenes.push(post);
  }

  mostrar_toast(mensaje:string){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
}

interface ArchivoSubir{
  titulo:string;
  img:string;
  key?:string;
}
