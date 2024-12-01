import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Persona } from '../types';
import { AlertController } from '@ionic/angular';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUsuarioService {

  constructor(private fireStore: AngularFirestore, 
    private fireAuthentication: AngularFireAuth, 
    private alertController: AlertController,
    private fireAuth: AngularFireAuth,) { }

  async crearUsuario(persona: any){
    const docRef = this.fireStore.collection('personas').doc(persona.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }

    const credencialesPersona = await this.fireAuthentication.createUserWithEmailAndPassword(persona.email,persona.contra);
    const uid = credencialesPersona.user?.uid;
    await docRef.set( {...persona});
    return true;
  }

  getUsuarios(){
    return this.fireStore.collection('personas').valueChanges();
  }

  getUsuario(rut: string){
    return this.fireStore.collection('personas').doc<Persona>(rut).valueChanges();
  }

  updateUsuario(persona: any){
    return this.fireStore.collection('personas').doc(persona.rut).update(persona);
  }

  deleteUsuario(rut: string){
    return this.fireStore.collection('personas').doc(rut).delete();
  }

  public async login(email: string, contrasena: string): Promise<boolean> {
    try {
     
      await this.fireAuthentication.signInWithEmailAndPassword(email, contrasena);
      
      const usuariosSnapshot = await this.fireStore.collection('personas', ref => ref.where('email', '==', email)).get().toPromise();
      
      if (usuariosSnapshot && !usuariosSnapshot.empty) {
        const usuario = usuariosSnapshot.docs[0].data() as { rut: string; nombre: string };
        const rut = usuario.rut || '';
        const nombre = usuario.nombre || '';
    
        localStorage.setItem('userRut', rut);
        localStorage.setItem('persona', JSON.stringify(usuario));
        localStorage.setItem('nombreConductor', nombre);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en el login:', error);
      return false;
    }
  }

  async recuperarContrasena(email: string): Promise<void> {
    try {
      await this.fireAuth.sendPasswordResetEmail(email);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha enviado el restablecimiento de la Contraseña a su Correo',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: this.obtenerMensajeError(error.code),
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  private obtenerMensajeError(codigo: string): string {
    switch (codigo) {
      case 'auth/user-not-found':
        return 'No existe este correo';
      case 'auth/invalid-email':
        return 'El correo ingresado no es válido.';
      default:
        return 'Ocurrió un error. Intente nuevamente.';
    }
  }

}
