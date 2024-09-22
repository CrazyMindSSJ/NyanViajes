import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service'; // Asegúrate de que este servicio esté importado correctamente

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
    private crudService: CrudService  // Inyectamos el CrudService
  ) { }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 2000 // Duración del loading en milisegundos
    });
    await loading.present();

    // Obtenemos los usuarios almacenados en el CRUD
    const usuariosRegistrados = this.crudService.getUsuarios();  // Obtenemos los usuarios

    // Validamos el usuario con el email y contraseña ingresados
    const usuarioValido = usuariosRegistrados.some(usuario => 
      usuario.email === this.email && usuario.contra === this.password  // Cambiamos `password` a `contra` para que coincida con el campo del registro
    );

    if (usuarioValido) {
      // Guardar información del usuario logueado en localStorage
      localStorage.setItem('usuarioLogueado', JSON.stringify({ email: this.email }));
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
