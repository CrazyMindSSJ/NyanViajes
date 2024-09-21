import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  persona: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.persona = this.formBuilder.group({
      rut: ['', Validators.required],
      nombre: ['', Validators.required],
      fecha_nacimiento: [''],
      genero: [''],
      email: ['', [Validators.required, Validators.email]],
      contra: ['', Validators.required],
      contraVali: ['', Validators.required],
      tiene_auto: [''],
      modelo: [''],
      marca: [''],
      color: [''],
      cant_asiento: [''],
      patente: [''],
    });
  }

  ngOnInit() {}

  registrar() {
    console.log(this.persona.value);
  }
}


