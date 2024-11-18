import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUsuarioService {

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth) { }

  async crearUsuario(persona: any){
    const docRef = this.fireStore.collection('personas').doc(persona.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }

    const credencialesPersona = await this.fireAuth.createUserWithEmailAndPassword(persona.email,persona.contra);
    const uid = credencialesPersona.user?.uid;
    await docRef.set( {...persona.uid});
    return true;
  }

  getUsuarios(){
    return this.fireStore.collection('personas').valueChanges();
  }

  getUsuario(rut: string){
    return this.fireStore.collection('personas').doc(rut).valueChanges();
  }

  updateUsuario(persona: any){
    return this.fireStore.collection('personas').doc(persona.rut).update(persona);
  }

  deleteUsuario(rut: string){
    return this.fireStore.collection('personas').doc(rut).delete();
  }

}
