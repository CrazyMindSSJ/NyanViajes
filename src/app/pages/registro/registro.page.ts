import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  // Función de validación personalizada para verificar si es mayor de 18 años
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

  // Validador personalizado para comparar contraseñas
  validarContrasenas(group: AbstractControl): ValidationErrors | null {
    const contra = group.get('contra')?.value;
    const contraVali = group.get('contraVali')?.value;
    return contra === contraVali ? null : { contrasenasNoCoinciden: true };
  }

  // Formulario persona, ahora con el nuevo campo 'categoria'
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-z A-Z]{3,30}")]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.mayorDeEdad.bind(this)]),
    genero: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[duocuc]+\\.[cl]{2}$")]),
    contra: new FormControl('', [Validators.required]),
    contraVali: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('No', [Validators.required]),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    color: new FormControl(''),
    cant_asiento: new FormControl('', []),
    patente: new FormControl('', [Validators.pattern("[A-Z]{2}-[A-Z0-9]{2}-[0-9]{2}")]),
    categoria: new FormControl('Estudiante', [Validators.required])
  });

  personas: any[] = [];

  constructor(
    private router: Router,
    private crudService: CrudService
  ) { }

  // Método para validar las contraseñas
  public validarContra(): boolean {
    return this.persona.controls.contra.value === this.persona.controls.contraVali.value;
  }

  ngOnInit() {
    this.personas = this.crudService.getUsuarios();
  }

  // Método de registro
  registrar() {
    console.log('Botón de registrar presionado');
    console.log(this.persona.value);
    if (this.crudService.createUsuarios(this.persona.value)) {
      alert("USUARIO CREADO CON ÉXITO!");
      this.persona.reset();
    } else {
      alert("ERROR! No se pudo crear el usuario!");
    }
  }
}
