import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

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

  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-z A-Z]{3,30}")]),
    // Aplica la validación personalizada aquí
    fecha_nacimiento: new FormControl('', [Validators.required, this.mayorDeEdad.bind(this)]),
    genero: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
    contra: new FormControl('', [Validators.required]),
    contraVali: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('No', [Validators.required]),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    color: new FormControl(''),
    cant_asiento: new FormControl('', [Validators.required]),
    patente: new FormControl('', [Validators.pattern("[A-Z]{2}-[A-Z0-9]{2}-[0-9]{2}")])
  });

  constructor(private router: Router) { }

  // Método para validar las contraseñas
  public validarContra(): boolean {
    return this.persona.controls.contra.value === this.persona.controls.contraVali.value;
  }

  ngOnInit() { }
  

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

  // Método de registro
  public registrar(): void {
    if (this.persona.valid) {
      console.log(this.persona.value);
      this.router.navigate(['/login']);
    } else {
      // Mostrar errores en el formulario si no es válido
      console.log('Formulario no válido');
    }
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }
  
}
