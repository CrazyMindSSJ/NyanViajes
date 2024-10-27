import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-registrar-viaje',
  templateUrl: './registrar-viaje.page.html',
  styleUrls: ['./registrar-viaje.page.scss'],
})
export class RegistrarViajePage implements OnInit, AfterViewInit {

  persona: any;
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;

  viaje = new FormGroup({
    conductor: new FormControl(),  // El nombre se establecerá después
    capa_disp: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),
    lat: new FormControl('', [Validators.required]),
    long: new FormControl('', [Validators.required]),
    dis_met: new FormControl('', [Validators.required]),
    tie_min: new FormControl(),
    estado: new FormControl('Pendiente'),
    valor: new FormControl('', [Validators.required]),
    pasajeros: new FormControl([]) // Mantener como array
  });

  constructor(private crudViajes: CrudViajesService, private router: Router, private navController: NavController) { }

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    this.viaje.controls.conductor.setValue(this.persona.nombre);
  }

  public async registrar() {
    console.log("Presiono registrar");
    const viajeData = this.viaje.value;
  
    const resultado = await this.crudViajes.createViaje(viajeData, this.persona.rut);
  
    if (resultado) {
      this.router.navigate(["home/viajes"]);
    } else {
      console.error("Error al registrar el viaje. Asegúrese de que el conductor exista.");
    }
  }
  
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.map.on('locationfound', (e) => {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    this.geocoder.on('markgeocode', (e) => {
      let lat = e.geocode.properties['lat'];
      let lon = e.geocode.properties['lon'];

      this.viaje.controls.destino.setValue(e.geocode.properties['display_name']);
      this.viaje.controls.lat.setValue(lat);
      this.viaje.controls.long.setValue(lon);

      if (this.map) {
        L.Routing.control({
          waypoints: [
            L.latLng(-33.59844040672239, -70.57881148451541),
            L.latLng(lat, lon)
          ],
          fitSelectedRoutes: true,
        }).on('routesfound', (e) => {
          this.viaje.controls.dis_met.setValue(e.routes[0].summary.totalDistance);
          this.viaje.controls.tie_min.setValue(Math.round(e.routes[0].summary.totalTime / 60));
        }).addTo(this.map);
      }
    });
  }
}
