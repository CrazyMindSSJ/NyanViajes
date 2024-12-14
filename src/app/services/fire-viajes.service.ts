import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseUsuarioService } from './firebase-usuario.service';
import { Viaje } from '../types';
import { firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseViajes{

  constructor(private firestore: AngularFirestore, private fireUsuario: FirebaseUsuarioService, private fireAuth: AngularFireAuth) {}


  async obtenerDatosUsuario() {
    const usuario = await this.fireAuth.authState.toPromise();
    if (usuario) {
      return this.firestore.collection('usuarios').doc(usuario.uid).valueChanges();
    }
    return null;
  }

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

      const conductor = await firstValueFrom(this.fireUsuario.getUsuario(rutConductor));
      if (!conductor) {
          return false; 
      }
      console.log(conductor)
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

  getViajesFinalizados(rut: string) {
    return this.firestore.collection<Viaje>('viajes', ref => 
      ref.where('estado', '==', 'Finalizado')
        .where('pasajeros', 'array-contains', rut)
      ).valueChanges();
  }

  getViaje(id_viaje: string) {
    return this.firestore.collection('viajes').doc<Viaje>(id_viaje).valueChanges();
  }

  updateViaje(viaje: any) {
    return this.firestore.collection('viajes').doc(viaje.id.toString()).update(viaje);
  }
  

  deleteViaje(id_viaje: string) {
    return this.firestore.collection('viajes').doc(id_viaje.toString()).delete();
  }

  public async tomarViaje(id_viaje: string, rut: string): Promise<boolean> {
    try {
      const viajeDoc = this.firestore.collection('viajes').doc(id_viaje);
      const viajeSnap = await viajeDoc.get().toPromise();
  
      if (!viajeSnap?.exists) return false;
  
      const viaje = viajeSnap.data() as any;
  
      // Validar capacidad y que el usuario no esté ya en la lista de pasajeros
      if (viaje.capa_disp <= 0 || (viaje.pasajeros && viaje.pasajeros.includes(rut))) return false;
  
      const nuevosPasajeros = [...(viaje.pasajeros || []), rut];
      const nuevaCapacidad = viaje.capa_disp - 1;
  
      await viajeDoc.update({
        pasajeros: nuevosPasajeros,
        capa_disp: nuevaCapacidad
      });
  
      return true;
    } catch (error) {
      console.error("Error al tomar el viaje:", error);
      return false;
    }
  }
  
  
  public async salirViaje(id_viaje: string, rut: string): Promise<boolean> {
    try {
      const viajeDoc = this.firestore.collection('viajes').doc(id_viaje);
      const viajeSnap = await viajeDoc.get().toPromise();
  
      if (!viajeSnap?.exists) return false;
  
      const viaje = viajeSnap.data() as any;
  
      // Validación: revisar si el usuario está en la lista de pasajeros
      if (!viaje.pasajeros || !viaje.pasajeros.includes(rut)) return false;
  
      // Actualizar lista de pasajeros y capacidad disponible
      const nuevosPasajeros = viaje.pasajeros.filter((pasajero: string) => pasajero !== rut);
      const nuevaCapacidad = viaje.capa_disp + 1;
  
      await viajeDoc.update({
        pasajeros: nuevosPasajeros,
        capa_disp: nuevaCapacidad
      });
  
      return true;
    } catch (error) {
      console.error("Error al salir del viaje:", error);
      return false;
    }
  }
  
  
  public async cambiarEstado(id_viaje: string, rutConductor: string): Promise<boolean> {
    try {
      const viajeDoc = this.firestore.collection('viajes').doc(id_viaje);
      const viajeSnap = await viajeDoc.get().toPromise();
  
      if (!viajeSnap?.exists) return false;
  
      const viaje = viajeSnap.data() as any;
  
      // Validar que solo el conductor pueda cambiar el estado
      if (viaje.rut_conductor !== rutConductor) return false;
  
      // Cambiar el estado del viaje según su estado actual
      const nuevoEstado =
        viaje.estado === 'Pendiente' ? 'En Curso' :
        viaje.estado === 'En Curso' ? 'Finalizado' : null;
  
      if (!nuevoEstado) return false;
  
      await viajeDoc.update({ estado: nuevoEstado });
      return true;
    } catch (error) {
      console.error("Error al cambiar el estado del viaje:", error);
      return false;
    }
  }
  
  
  public async esConductorDelViaje(id_viaje: string, rut: string): Promise<boolean> {
    const viajeSnap = await this.firestore.collection('viajes').doc(id_viaje).get().toPromise();
  
    if (!viajeSnap?.exists) return false;
  
    const viaje = viajeSnap.data() as any;
    return viaje.conductor === rut;
  }
  
  
}
