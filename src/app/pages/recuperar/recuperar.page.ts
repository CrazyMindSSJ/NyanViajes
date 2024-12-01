import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email : string = "";
  mensaje: string = '';
  mensajeColor: string = 'danger';

  constructor(private router: Router,
    private crudService: CrudService,
    private alertController: AlertController,
    private fireAuth: AngularFireAuth,) { }

  ngOnInit() {
  }

  async recuperar(){
    if(await this.crudService.recuperarUsuario(this.email)){
      alert("Revisa tu correo para encontrar la nueva contraseña!")
      this.router.navigate(['/login']);
    }else{
      alert("ERROR! el usuario no existe!")
    }
  }

  async recuperarContrasena(email: string) {
    if (!email || !email.includes('@')) {
      this.mensaje = 'Por favor, ingrese un correo válido.';
      this.mensajeColor = 'danger';
      return;
    }

    try {
      await this.fireAuth.sendPasswordResetEmail(email);
      this.mensaje = 'Se ha enviado un correo para restablecer tu contraseña.';
      this.mensajeColor = 'success';

      // Opcional: Mostrar alerta adicional
      const alert = await this.alertController.create({
        header: 'Correo Enviado!',
        message: 'Se ha enviado un correo para Restablecer la Contraseña!',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error: any) {
      // Manejo de errores de Firebase
      this.mensaje = this.obtenerMensajeError(error.code);
      this.mensajeColor = 'danger';
    }
  }

  private obtenerMensajeError(codigo: string): string {
    switch (codigo) {
      case 'auth/user-not-found':
        return 'No existe este correo.';
      case 'auth/invalid-email':
        return 'El correo ingresado no es válido.';
      default:
        return 'Ocurrió un error. Intenta nuevamente.';
    }
  }

}
