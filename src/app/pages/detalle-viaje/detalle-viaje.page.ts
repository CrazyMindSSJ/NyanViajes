import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { firstValueFrom } from 'rxjs';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';
import { FirebaseUsuarioService } from 'src/app/services/firebase-usuario.service';
import type { Viaje } from 'src/app/types';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  id: string = '';
  viaje: any = {
    id: 0,
    conductor: '',
    rut_conductor: '',
    capa_disp: 0,
    destino: '',
    lat: '',
    long: '',
    dis_met: 0,
    tie_min: 0,
    estado: '',
    valor: 0,
    hora_salida: '',
    pasajeros: [],
    pasajerosNombres: []
  };

  persona: any;
  puedeTomarViaje: boolean = false;
  viajeFinalizado: boolean = false;
  isLoading: boolean = true;
  private map: L.Map | undefined;

  constructor(
    private activatedRouted: ActivatedRoute,
    private fireViajes: FirebaseViajes,
    private fireUsuario: FirebaseUsuarioService
  ) { }

  async ngOnInit() {
    this.id = this.activatedRouted.snapshot.paramMap.get('id') || '';
    this.persona = JSON.parse(localStorage.getItem("persona") || '{}');
    await this.obtenerViaje();
  }

  async obtenerViaje() {
    const viaje = await firstValueFrom(this.fireViajes.getViaje(this.id));
    if (viaje) {
      this.viaje = viaje ;
    } else {
      console.error('Viaje no encontrado');
      return;
    }

    for (let i = 0; i < this.viaje.pasajeros.length; i++) {
      const rut = this.viaje.pasajeros[i];
      const pasajero = await firstValueFrom(this.fireUsuario.getUsuario(rut));
      if (!pasajero) continue;
      if (!this.viaje.pasajerosNombres) this.viaje.pasajerosNombres = [];
      this.viaje.pasajerosNombres.push(pasajero.nombre);
    }

    this.puedeTomarViaje =
      this.viaje.capa_disp > 0 &&
      !this.viaje.pasajeros.includes(this.persona.rut);
    this.initMap();
  }

  async tomarViaje() {
    this.isLoading = true;
    const exito = await this.fireViajes.tomarViaje(this.id, this.persona.rut);
    if (exito) {
      console.log("Viaje tomado con éxito");
      await this.obtenerViaje();
    } else {
      console.error("Error al intentar tomar el viaje");
    }
    this.isLoading = false;
  }

  async salirDelViaje() {
    this.isLoading = true;
    const exito = await this.fireViajes.salirViaje(this.id, this.persona.rut);
    if (exito) {
      console.log("Has salido del viaje");
      await this.obtenerViaje();
    } else {
      console.error("Error al intentar salir del viaje");
    }
    this.isLoading = false;
  }

  async cambiarEstadoViaje() {
    this.isLoading = true;
    const exito = await this.fireViajes.cambiarEstado(this.id, this.viaje.rut_conductor);
    console.log(exito)
    if (exito) {
      console.log("Estado del viaje cambiado");
      await this.obtenerViaje();
    } else {
      console.error("Error al intentar cambiar el estado del viaje");
    }
    this.isLoading = false;
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
