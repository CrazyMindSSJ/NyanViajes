import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  // Formulario para registrar/actualizar usuarios
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-z A-Z]{3,30}")]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.mayorDeEdad.bind(this)]),
    genero: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[duocuc.-]+\\.[CLcl]{2,}$")]),
    contra: new FormControl('', [Validators.required]),
    contraVali: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('No', [Validators.required]),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    color: new FormControl(''),
    cant_asiento: new FormControl(''),
    patente: new FormControl('', [Validators.pattern("[A-Z]{2}-[A-Z0-9]{2}-[0-9]{2}")]),
    categoria: new FormControl('', [Validators.required])
  });

  personas: any[] = []; // Lista de usuarios

  constructor(
    private router: Router,
    private crudService: CrudService) { }

  ngOnInit() {
    this.actualizarListaPersonas(); // Cargar la lista de usuarios al iniciar
  }

  // Método para validar que el usuario sea mayor de edad
  mayorDeEdad(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad >= 18 ? null : { menorDeEdad: true }; // Retornar error si es menor de 18
  }

  // Método para registrar un nuevo usuario
  registrar() {
    if (this.crudService.createUsuarios(this.persona.value)) {
      alert("USUARIO CREADO CON ÉXITO!");
      this.actualizarListaPersonas(); // Actualiza la lista de usuarios
      this.persona.reset(); // Resetea el formulario
    } else {
      alert("ERROR! No se pudo crear el usuario!");
    }
  }

  // Método para buscar un usuario por RUT
  buscar(rut_buscar: string) {
    const usuarioEncontrado = this.crudService.getUsuario(rut_buscar);
    if (usuarioEncontrado) {
      this.persona.setValue(usuarioEncontrado); // Rellena el formulario con los datos encontrados
    } else {
      alert("Usuario no encontrado");
    }
  }

  // Método para modificar un usuario existente
  modificar() {
    const rut_buscar = this.persona.controls.rut.value;
    if (!rut_buscar) {
      alert("RUT no válido para modificar");
      return;
    }

    if (this.crudService.updateUsuarios(rut_buscar, this.persona.value)) {
      alert("Usuario modificado con éxito");
      this.actualizarListaPersonas(); // Actualiza la lista después de modificar
      this.persona.reset(); 
    } else {
      alert("Error! usuario no modificado");
    }
  }

  // Método para eliminar un usuario
  eliminar(rut_eliminar: string) {
    if (this.crudService.deleteUsuarios(rut_eliminar)) {
      alert("Usuario eliminado con éxito!");
      this.actualizarListaPersonas(); // Actualiza la lista después de eliminar
    } else {
      alert("ERROR! Usuario no eliminado");
    }
  }

  // Método para actualizar la lista de usuarios
  actualizarListaPersonas() {
    this.personas = this.crudService.getUsuarios(); // Cargar usuarios desde el servicio
  }

  // Método para limpiar el formulario
  limpiar() {
    this.persona.reset();
  }
}


