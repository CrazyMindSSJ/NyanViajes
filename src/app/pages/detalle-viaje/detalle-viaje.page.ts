import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { CrudService } from 'src/app/services/crud.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit, AfterViewInit {
  id: number = 0;
  viaje: any = {};
  persona: any;
  puedeTomarViaje: boolean = false;
  esConductor: boolean = false;
  viajeFinalizado: boolean = false; 
  private map: L.Map | undefined;

  constructor(
    private activatedRouted: ActivatedRoute,
    private crudViajes: CrudViajesService,
    private crudUsuarios: CrudService
  ) {}

  async ngOnInit() {
    this.id = +this.activatedRouted.snapshot.paramMap.get("id")!;
    this.persona = JSON.parse(localStorage.getItem("persona") || '{}');
    this.esConductor = this.persona.tiene_auto === 'Si';

    await this.obtenerViaje();
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
    
    if (this.map) {
      this.map.remove();
    }

    this.initMap();
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

  ngAfterViewInit() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  initMap() {
    if (!this.map && this.viaje && this.viaje.lat && this.viaje.long) {
      setTimeout(() => {
        this.map = L.map('map_html').setView([+this.viaje.lat, +this.viaje.long], 13);
  
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
  
        // Configura el punto de origen y destino de la ruta
        const puntoOrigen = L.latLng(-33.59844040672239, -70.57881148451541); // Ajusta a la ubicación de inicio deseada
        const puntoDestino = L.latLng(+this.viaje.lat, +this.viaje.long);
  
        // Agrega el control de rutas con puntos dinámicos
        if (this.map) {
          L.Routing.control({
            waypoints: [
              puntoOrigen,  // Punto inicial
              puntoDestino  // Destino del viaje (dinámico)
            ],
            routeWhileDragging: false,
            fitSelectedRoutes: true
          }).addTo(this.map);
        }
      }, 0);
    }
  }
  
}
