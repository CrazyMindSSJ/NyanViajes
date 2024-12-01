import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnsubscriptionError } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { FirebaseUsuarioService } from 'src/app/services/firebase-usuario.service';
import { __awaiter } from 'tslib';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  // Formulario para registrar/actualizar usuarios
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z ]{3,}")]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9.]+(@duocuc.cl)")]),
    contra: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    contraVali: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    tiene_auto: new FormControl('No', [Validators.required]),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    color: new FormControl(''),
    cant_asiento: new FormControl('', []),
    patente: new FormControl('', [Validators.pattern("^[a-zA-Z0-9]{5}$")]),
    categoria: new FormControl('Estudiante', [Validators.required])
  });

  personas: any[] = [];

  botonModificar: boolean = true;

  constructor(
    private router: Router,
    private firebase: FirebaseUsuarioService) { 
      this.persona.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);
      
    }

  async ngOnInit() {
    this.cargarUsuarios();
  }

  validarEdad18(fecha_nacimiento: string){
    var edad = 0;
    if(fecha_nacimiento){
      const fecha_date = new Date(fecha_nacimiento);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
    if(edad>=18){
      return true;
    }else{
      return false;
    }
  }

  validarRut():ValidatorFn{
    return () => {
      const rut = this.persona.controls.rut.value;
      const dv_validar = rut?.replace("-","").split("").splice(-1).reverse()[0];
      let rut_limpio = [];
      if(rut?.length==10){
        rut_limpio = rut?.replace("-","").split("").splice(0,8).reverse();
      }else{
        rut_limpio = rut?.replace("-","").split("").splice(0,7).reverse() || [];
      }
      let factor = 2;
      let total = 0;
      for(let num of rut_limpio){
        total = total + ((+num)*factor);
        factor = factor + 1;
        if(factor==8){
          factor = 2;
        }
      }
      var dv = (11-(total%11)).toString();
      if(+dv>=10){
        dv = "k";
      }
      if(dv_validar!=dv.toString()) return {isValid: false};
      return null;
    };
  }

  cargarUsuarios(){
    this.firebase.getUsuarios().subscribe(data=>{this.personas = data});

  }

  validarPatente(): ValidatorFn {
    return (control) => {
      const patente = control.value;
      const patenteRegex = /^[A-Z]{2}\d{5}$|^[A-Z]{3}\d{5}$/;
      if (!patenteRegex.test(patente)) {
        return { isValid: false }; 
      }
      return null; 
    };
  }

  async registrar(){
    if(await this.firebase.crearUsuario(this.persona.value)){
      alert("USUARIO REGISTRADO!");
      this.persona.reset();
    }else{
      alert("ERROR! USUARIO YA EXISTE!");
    }
  }

  async buscar(persona:any){
    if (persona) {
      this.persona.patchValue(persona); 
      this.botonModificar = true;
      console.log(persona)
    } else {
      this.botonModificar = false;
    }
  }

  async modificar(){
    this.firebase.updateUsuario(this.persona.value).then(()=>{
      alert("USUARIO MODIFICADO!");
      this.persona.reset();
    }).catch(error=>{
      console.log("ERROR: " + error);
    });
  }

  async eliminar(rut_eliminar:string){
    this.firebase.deleteUsuario(rut_eliminar);

  }

  limpiar() {
    this.persona.reset();
  }
}


