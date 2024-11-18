import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseItemService {

  constructor(private firestore: AngularFirestore) {}

  async crearViaje(viaje: any) {
    try {
      const docRef = this.firestore.collection('viajes').doc(viaje.id);
      const docActual = await docRef.get().toPromise();
      if (docActual?.exists) {
        throw new Error('El item ya existe.');
      }
      await docRef.set(viaje);
      return true;
    } catch (error) {
      console.error('Error al crear item:', error);
      return false;
    }
  }

  getViajes() {
    return this.firestore.collection('viajes').valueChanges();
  }

  getItem(id: string) {
    return this.firestore.collection('viajes').doc(id).valueChanges();
  }

  updateItem(viaje: any) {
    return this.firestore.collection('viajes').doc(viaje.id).update(viaje);
  }

  deleteItem(id: string) {
    return this.firestore.collection('viajes').doc(id).delete();
  }
}