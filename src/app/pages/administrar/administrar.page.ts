import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  mayorDeEdad(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    // Calcular la edad
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    // Ajustar si el cumpleaños aún no ha pasado este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    // Retornar un error si el usuario es menor de 18
    return edad >= 18 ? null : { menorDeEdad: true };
  }

  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-z A-Z]{3,30}")]),
    // Aplica la validación personalizada aquí
    fecha_nacimiento: new FormControl('', [Validators.required, this.mayorDeEdad.bind(this)]),
    genero: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[duocuc.-]+\\.[CLcl]{2,}$")]),
    contra: new FormControl('', [Validators.required]),
    contraVali: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('No', [Validators.required]),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    color: new FormControl(''),
    cant_asiento: new FormControl('', []),
    patente: new FormControl('', [Validators.pattern("[A-Z]{2}-[A-Z0-9]{2}-[0-9]{2}")]),
    categoria: new FormControl('', [Validators.required])
  });

  personas:any[] = [];
  constructor(
    private router: Router,
    private crudService: CrudService) { }

  ngOnInit() {
    this.personas = this.crudService.getUsuarios();
  }

  registrar() {
    console.log('Botón de registrar presionado');//se verifican que se ejecute una accion al presionar
    console.log(this.persona.value); // Muestra los valores del formulario en la consola
    if (this.crudService.createUsuarios(this.persona.value)) {
      alert("USUARIO CREADO CON ÉXITO!");
      this.actualizarListaPersonas(); // Actualiza la lista de personas
      this.persona.reset(); // Resetea el formulario
    } else {
      alert("ERROR! No se pudo crear el usuario!");
    }
  }
  

  buscar(rut_buscar:string){
    console.log('Botón de buscar presionado');
    this.persona.setValue( this.crudService.getUsuario(rut_buscar) );
  }

  modificar() {
    console.log('Botón de modificar presionado');
    const rut_buscar = this.persona.controls.rut.value;
    if (!rut_buscar) {
      alert("RUT no válido para modificar");
      return;
    }
  
    if (this.crudService.updateUsuarios(rut_buscar, this.persona.value)) {
      alert("Usuario modificado con éxito");
      this.actualizarListaPersonas();
      this.persona.reset(); 
    } else {
      alert("Error! usuario no modificado");
    }
  }
  

  eliminar(rut_eliminar:string){
    console.log('Botón de eliminar presionado');
    console.log(rut_eliminar);
    if(this.crudService.deleteUsuarios(rut_eliminar)){
      alert("Usuario eliminado con éxito!")
    }else{
      alert("ERROR! Usuario no eliminado")
    }
  }

  actualizarListaPersonas() {
    this.personas = this.crudService.getUsuarios();
  }
  
  limpiar() {
    console.log('Botón de limpiar presionado');
    this.persona.reset();
  }
}


