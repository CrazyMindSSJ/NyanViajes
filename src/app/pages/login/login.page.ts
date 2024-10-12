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
  contrasena: string = "";

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
    await loading.present()
    if(await this.crudService.login(this.email,this.contrasena)){
      this.router.navigate(['/home']);
    }else{
      alert("Correo o contraseña invalidos! intente nuevamente");
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
    return this.email.trim() === '' || this.contrasena.trim() === '';
  }
}
