import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  nombre: string | null = null; // Cambiar a 'null' inicialmente
  tipUsuario: string | null = null; // Inicializar tipUsuario

  constructor() {
    // Obtener el objeto del usuario desde localStorage
    const usuarioJSON = localStorage.getItem('usuarioLogueado');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombre = usuario.nombre; // Acceder al nombre

      // Asignar valor a tipUsuario según tienes_auto
      this.tipUsuario = usuario.tiene_auto === 'Si' ? 'Conductor' : 'Pasajero';
    }
  }
}
