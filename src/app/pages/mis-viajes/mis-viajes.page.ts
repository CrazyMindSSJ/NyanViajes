import { Component, OnInit } from '@angular/core';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage implements OnInit {
  misViajes: any[] = [];
  persona: any;

  constructor(private crudViajes: CrudViajesService) { }

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    this.obtenerMisViajes();
  }

  async obtenerMisViajes() {
    if (this.persona) {
      const rut = this.persona.rut; // Asegúrate de que 'rut' sea el campo correcto
      this.misViajes = await this.crudViajes.getViaje(rut);
    }
  }
}
