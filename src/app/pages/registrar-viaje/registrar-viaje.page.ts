import { Component, OnInit } from '@angular/core';
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
export class RegistrarViajePage implements OnInit {

  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;

  viaje = new FormGroup({
    id_viaje: new FormControl(),
    conductor: new FormControl('',[Validators.required]),
    capa_disp: new FormControl('',[Validators.required]),
    destino: new FormControl('',[Validators.required]),
    lat: new FormControl('',[Validators.required]),
    long: new FormControl('',[Validators.required]),
    dis_met: new FormControl('',[Validators.required]),
    tie_min: new FormControl(),
    estado: new FormControl('pendiente'),
    valor: new FormControl('',[Validators.required]),
    pasajeros: new FormControl([])
  })

  viajes: any[] = [];
  constructor(private crudViajes: CrudViajesService, private router: Router,private navController: NavController) { }

  ngOnInit() {
  }

  public async registrar(){
    if(await this.crudViajes.createViaje(this.viaje.value)){
      this.router.navigate(["/viaje"])
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap(){
    this.map = L.map("map_html").locate({setView:true,maxZoom:16});

    var marker = L.marker([-33.59844040672239, -70.57881148451541]).addTo(this.map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map)

    this.map.on('locationfound',(e)=>{
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    this.geocoder.on('markgeocode', (e)=>{
      let lat = e.geocode.properties['lat'];
      let lon = e.geocode.properties['lon'];
      this.viaje.controls.destino.setValue(e.geocode.properties['display_name']);
      this.viaje.controls.lat.setValue(lat);
      this.viaje.controls.long.setValue(lon);

      if(this.map){
        L.Routing.control({
          waypoints: [L.latLng(-33.608552227594245, -70.58039819211703),
            L.latLng(lat,lon)],
            fitSelectedRoutes: true,
          }).on('routesfound', (e)=>{
            this.viaje.controls.dis_met.setValue(e.routes[0].summary.totalDistance);
            this.viaje.controls.tie_min.setValue(Math.round(e.routes[0].summary.totalTime/60));
        }).addTo(this.map);
      }
    });

  }
}
