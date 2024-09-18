import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


  persona = new FormGroup({
    rut: new FormControl('',[Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.pattern("[a-z A-Z]{3,30}")]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.pattern("[a-z][@][a-z].[a-z]")]),
    contra:new FormControl('',[Validators.required]),
    contraVali:new FormControl('',[Validators.required,]),
    tiene_auto : new FormControl('No',[Validators.required ]),
    modelo : new FormControl('',[]),
    marca : new FormControl('',[]),
    color : new FormControl('',[]),
    cant_asiento : new FormControl('',[Validators.pattern("[0-9]{1}")]),
    patente : new FormControl('',[Validators.pattern("[A-Z]{2}-[A-Z0-9]{2}-[0-9]{2}")])
  });

  constructor(private router: Router) { }

  public validarContra(){
    if(this.persona.controls.contra.value == this.persona.controls.contraVali.value){
      return true;
    }
    return false;
  }

  ngOnInit() {
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  public registrar():void {
    console.log(this.persona.value);
    //alert("registrado!");
    this.router.navigate(['/login']);
  };

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }
}