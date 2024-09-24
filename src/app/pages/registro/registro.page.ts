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
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad >= 18 ? null : { menorDeEdad: true };
  }

  // Validador para comparar contraseñas
  validarContrasenas(group: AbstractControl): ValidationErrors | null {
    const contra = group.get('contra')?.value;
    const contraVali = group.get('contraVali')?.value;
    return contra === contraVali ? null : { contrasenasNoCoinciden: true };
  }

  // Formulario persona
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,30}")]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.mayorDeEdad.bind(this)]),
    genero: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[duocuc]+\\.[cl]{2}$")]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    contraVali: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('No', [Validators.required]),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    color: new FormControl(''),
    cant_asiento: new FormControl('', []),
    patente: new FormControl('', [Validators.pattern("^[a-zA-Z0-9]{5}$")]),
    categoria: new FormControl('Estudiante', [Validators.required])
  });

  personas: any[] = [];

  constructor(private router: Router, private crudService: CrudService) { }

  ngOnInit() {
    this.personas = this.crudService.getUsuarios();
  }

  // Método de registro
  registrar() {
    console.log('Botón de registrar presionado');
    console.log(this.persona.value);
    if (this.crudService.createUsuarios(this.persona.value)) {
      alert("USUARIO CREADO CON ÉXITO!");
      localStorage.setItem('usuarioLogueado', JSON.stringify(this.persona.value));
      this.router.navigate(['/login']);
      this.persona.reset();
    } else {
      alert("ERROR! No se pudo crear el usuario!");
    }
  }
}
