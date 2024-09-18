
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

 //Variables para mostrar la contraseña
 tipoContrasenia: string = 'password';  
 iconoContrasenia: string = 'eye';  

  email: string = "";
  password: string = "";
  
  constructor(private router: Router) { }

  //método asociado al boton para hacer un login:
  login(){
    if(this.email=="" && this.password==""){
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

  public recuperar = [
    { type: 'textarea', placeholder: 'Ingrese su correo para enviar link de recuperación' },
  ];
}
