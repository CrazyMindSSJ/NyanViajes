import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  id: number = 0;
  viaje: any = {};
  persona: any;
  puedeTomarViaje: boolean = false;
  esConductor: boolean = false;
  viajeFinalizado: boolean = false; 

  constructor(
    private activatedRouted: ActivatedRoute,
    private crudViajes: CrudViajesService,
    private crudUsuarios: CrudService
  ) {}

  async ngOnInit() {
    this.id = +this.activatedRouted.snapshot.paramMap.get("id")!;
    this.persona = JSON.parse(localStorage.getItem("persona") || '{}');
    this.esConductor = this.persona.tiene_auto === 'Si';

    this.obtenerViaje();
  }

  async obtenerViaje() {
    this.viaje = await this.crudViajes.getViaje(this.id);
  
    if (!this.viaje) {
      console.error('Viaje no encontrado');
      return;
    }
  
    this.viaje.pasajerosNombres = this.viaje.pasajerosNombres || [];
    console.log('Pasajeros:', this.viaje.pasajerosNombres);
    
    this.puedeTomarViaje = !this.esConductor && this.viaje.capa_disp > 0 && !this.viaje.pasajeros.includes(this.persona.rut);
  }

  async tomarViaje() {
    const exito = await this.crudViajes.tomarViaje(this.id, this.persona.rut);
    if (exito) {
      await this.obtenerViaje(); 
    }
  }

  async salirDelViaje() {
    const exito = await this.crudViajes.salirViaje(this.id, this.persona.rut);
    if (exito) {
      await this.obtenerViaje();
    }
  }

  async cambiarEstado() {
    if (this.esConductor) {
      const exito = await this.crudViajes.cambiarEstadoViaje(this.id);
      if (exito) {
        this.viaje.estado = this.viaje.estado === 'Pendiente' ? 'En Curso' : 'Finalizado';
        this.viajeFinalizado = this.viaje.estado === 'Finalizado';
      }
    }
  }
}
