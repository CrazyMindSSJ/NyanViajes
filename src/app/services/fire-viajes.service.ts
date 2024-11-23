import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseUsuarioService } from './firebase-usuario.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseViajes{

  constructor(private firestore: AngularFirestore, private fireUsuario: FirebaseUsuarioService) {}

  // Método para obtener y actualizar el contador global
  private async getNewId(): Promise<number> {
    const counterRef = this.firestore.collection('counters').doc('tripCounter');
    const counterSnap = await counterRef.get().toPromise();
  
    if (counterSnap?.exists) {
      // Obtener el valor del contador actual con tipado explícito
      const data = counterSnap.data() as { value: number }; // Tipo explícito
      const currentValue = data?.value || 0;
  
      // Incrementar el contador
      await counterRef.update({ value: currentValue + 1 });
      return currentValue + 1;
    } else {
      // Si el documento no existe, crearlo con un valor inicial de 1
      await counterRef.set({ value: 1 });
      return 1;
    }
  }
  

  // Método para crear un viaje con ID autoincrementable
  async crearViaje(viaje: any, rutConductor: string) {
    try {
      // Obtener un nuevo ID
      const newId = await this.getNewId();

      // Añadir el ID al objeto del viaje
      viaje.id = newId;

      const conductor = await this.fireUsuario.getUsuario(rutConductor);
      if (!conductor) {
          return false; 
      }

      const docRef = this.firestore.collection('viajes').doc(newId.toString());
      const docActual = await docRef.get().toPromise();

      if (docActual?.exists) {
        throw new Error('El item ya existe.');
      }

      await docRef.set(viaje);
      return true;
    } catch (error) {
      console.error('Error al crear viaje:', error);
      return false;
    }
  }

  getViajes() {
    return this.firestore.collection('viajes').valueChanges();
  }

  getViaje(id: string) {
    return this.firestore.collection('viajes').doc(id).valueChanges();
  }

  updateViaje(viaje: any) {
    return this.firestore.collection('viajes').doc(viaje.id).update(viaje);
  }

  deleteViaje(id: string) {
    return this.firestore.collection('viajes').doc(id).delete();
  }
}
