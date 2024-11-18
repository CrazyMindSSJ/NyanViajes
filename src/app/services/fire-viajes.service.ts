import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FireViajesService {

  constructor(private fireStore: AngularFirestore) { }

  async crearViaje(viaje: any){
    
  }

}
