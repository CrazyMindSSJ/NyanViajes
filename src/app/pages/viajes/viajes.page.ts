import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';


@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  
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
    pasajeros: new FormControl([])
  })

  viajes: any[] = [];

  constructor(private crudViajes: CrudViajesService) { }



  ngOnInit() {
  }

  async obtenerViajes(){
    this.viajes = await this.crudViajes.getViajes();
  }

}
