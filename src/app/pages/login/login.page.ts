import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { FirebaseUsuarioService } from 'src/app/services/firebase-usuario.service';

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
    private fireUsuario: FirebaseUsuarioService
  ) { }

  async login() {
    if(await this.fireUsuario.login(this.email,this.contrasena)){
      this.router.navigate(['/home']);
    }else{
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

  
}
