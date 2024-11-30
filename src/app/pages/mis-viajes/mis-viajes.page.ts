import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';
import { Viaje } from 'src/app/types';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage implements OnInit {
  misViajes: Viaje[] = [];
  persona: any;
  viaje = new FormGroup({
    id_viaje: new FormControl(),
    conductor: new FormControl(),
    capa_disp: new FormControl(),
    destino: new FormControl(),
    lat: new FormControl(),
    long: new FormControl(),
    dis_met: new FormControl(),
    tie_min: new FormControl(),
    estado: new FormControl('Pendiente'),
    valor: new FormControl(),
    hora_salida: new FormControl(),
    pasajeros: new FormControl([]),
  });


  constructor(private crudViajes: FirebaseViajes) { }

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    this.obtenerMisViajes();
  }

  async obtenerMisViajes() {
    this.crudViajes.getViajesFinalizados(this.persona.rut).subscribe((viajes) => {
      this.misViajes = viajes;
    });
  }
}