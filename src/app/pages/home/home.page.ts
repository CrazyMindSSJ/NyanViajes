import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAdmin: boolean = false; // Indica si el usuario es administrador
  nombreUsuario: string = ''; // Nombre del usuario logueado
  edadUsuario: number | null = null; // Edad del usuario logueado

  constructor() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');

    if (usuarioLogueado) {
      this.isAdmin = usuarioLogueado.isAdmin; // Verificamos si el usuario logueado es admin
      this.nombreUsuario = this.isAdmin ? 'Admin' : usuarioLogueado.nombre; // Asigna el nombre correcto
      this.edadUsuario = this.calcularEdad(usuarioLogueado.fecha_nacimiento); // Calcula la edad
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Ajusta si el cumpleaños aún no ha pasado este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad; // Devuelve la edad calculada
  }
}


