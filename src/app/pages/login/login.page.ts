import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  tipoContrasenia: string = 'password';  
  iconoContrasenia: string = 'eye';  
  email: string = "";
  password: string = "";

  constructor(
    private router: Router, 
    private loadingController: LoadingController, 
    private crudService: CrudService
  ) { }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 2000 
    });
    await loading.present();

    // Validamos el usuario con el email y contraseña ingresados
    const usuario = this.crudService.validarUsuario(this.email, this.password); // Usamos el método validarUsuario

    if (usuario) {
      // Guardar información del usuario logueado en localStorage
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario)); // Guardamos toda la información del usuario
      this.router.navigate(['/home']);  // Si es válido, redirige a home
    } else {
      alert("CORREO O CONTRASEÑA INCORRECTOS!");  // Si no es válido, muestra un mensaje de error
    }
  }

  mostrarClave() {
    if (this.tipoContrasenia === 'password') {
      this.tipoContrasenia = 'text';       
      this.iconoContrasenia = 'eye-off';  
    } else {
      this.tipoContrasenia = 'password';   
      this.iconoContrasenia = 'eye';       
    }
  }

  ngOnInit() { }

  get isLoginDisabled() {
    // Deshabilitar el botón si no se ingresan email o password
    return this.email.trim() === '' || this.password.trim() === '';
  }
}
