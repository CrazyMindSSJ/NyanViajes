import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  nombreUsuario: string | null = null; // Cambiar a 'null' inicialmente

  constructor() {
    // Obtener el nombre del usuario desde localStorage
    this.nombreUsuario = localStorage.getItem('nombreUsuario');
  }
}

