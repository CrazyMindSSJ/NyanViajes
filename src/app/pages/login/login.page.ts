import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // Variables para mostrar la contraseña
  tipoContrasenia: string = 'password';  
  iconoContrasenia: string = 'eye';  

  email: string = "";
  password: string = "";

  // Suponiendo que tienes un array de usuarios registrados para la validación
  usuariosRegistrados = [
    { email: 'miau@gmail.com', password: 'contraseña' },
    // Agrega más usuarios según sea necesario
  ];

  constructor(private router: Router, private loadingController: LoadingController) { }

  // Método asociado al botón para hacer un login
  async login() {
    // Mostrar el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 2000 // Duración del loading en milisegundos
    });
    await loading.present();

    // Validar usuario
    const usuarioValido = this.usuariosRegistrados.some(usuario => 
      usuario.email === this.email && usuario.password === this.password
    );

    if (usuarioValido) {
      this.router.navigate(['/home']);
    } else {
      alert("CORREO O CONTRASEÑA INCORRECTOS!");
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

  public recuperar = [
    { type: 'textarea', placeholder: 'Ingrese su correo para enviar link de recuperación' },
  ];
}
