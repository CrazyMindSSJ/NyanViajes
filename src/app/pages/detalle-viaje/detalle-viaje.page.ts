// detalle-viaje.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {

  id: number = 0;
  viaje: any;

  constructor(private activatedRouted: ActivatedRoute, private crudViajes: CrudViajesService) { }

  ngOnInit() {
    this.id = +(this.activatedRouted.snapshot.paramMap.get("id") || "");
    this.obtenerViaje();
  }

  obtenerViaje() {
    this.viaje = this.crudViajes.getViaje(this.id);
  }

}
