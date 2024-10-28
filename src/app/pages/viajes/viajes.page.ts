import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { CrudViajesService } from 'src/app/services/crud-viajes.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

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
    estado: new FormControl('pendiente'),
    valor: new FormControl(),
    pasajeros: new FormControl([]),
  });

  viajes: any[] = [];
  
  constructor(private crudViajes: CrudViajesService, private router: Router) { }

  ngOnInit() {
    this.obtenerViajes();
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
  }

  async obtenerViajes() {
    const allViajes = await this.crudViajes.getViajes();
    this.viajes = allViajes
      .filter(viaje => viaje.capa_disp > 0 && viaje.estado !== "Finalizado"); 
  }
<<<<<<< HEAD
  
  
}
=======

  irAHistorial() {
    this.router.navigate(['/mis-viajes']); // Redirige a la página de historial
  }
}
>>>>>>> 83bc3bb9c1978002bd56c0c0ebae3a027d47d3b0
