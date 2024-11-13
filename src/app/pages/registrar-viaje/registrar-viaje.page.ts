import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { AlertController } from '@ionic/angular';

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
    conductor: new FormControl(),  
    capa_disp: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),
    lat: new FormControl('', [Validators.required]),
    long: new FormControl('', [Validators.required]),
    dis_met: new FormControl('', [Validators.required]),
    tie_min: new FormControl(),
    estado: new FormControl('Pendiente'),
    valor: new FormControl('', [Validators.required]),
    hora_salida: new FormControl('',Validators.required),
    pasajeros: new FormControl([]) 
  });

  constructor(private crudViajes: CrudViajesService, private router: Router, private navController: NavController, private alertController: AlertController) { }

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    this.viaje.controls.conductor.setValue(this.persona.nombre);
  }

  public async registrar() {
    console.log("Presiono registrar");

    const confirmAlert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Seguro quieres realizar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Registro de viaje cancelado");
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {
            const viajeData = this.viaje.value;
            const resultado = await this.crudViajes.createViaje(viajeData, this.persona.rut);

            if (resultado) {
              const successAlert = await this.alertController.create({
                header: 'Viaje creado',
                message: 'Viaje generado con éxito',
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.router.navigate(['home/viajes']).then(() => {
                        window.location.reload(); // Refresca la pantalla después de redirigir a home/viajes
                      });
                    }
                  }
                ]
              });
              await successAlert.present();
            } else {
              console.error("Error al registrar el viaje. Asegúrese de que el conductor exista.");
            }
          }
        }
      ]
    });

    await confirmAlert.present();
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
            L.latLng(-33.59844040672239, -70.57881148451541), // Cambia esto a las coordenadas que necesites
            L.latLng(lat, lon)
          ],
          fitSelectedRoutes: true,
        }).on('routesfound', (e) => {
          this.viaje.controls.dis_met.setValue(e.routes[0].summary.totalDistance);
          this.viaje.controls.tie_min.setValue(Math.round(e.routes[0].summary.totalTime / 60));
        }).addTo(this.map);
      }
    });
  
    // Definición del ícono verde
    var greenIcon = L.icon({
      iconUrl: 'leaf-red.png',
      iconSize: [38, 95], 
      iconAnchor: [22, 94], 
      popupAnchor: [-3, -76] 
    });
  
    // Agregar el marcador con el ícono verde en la ubicación de Duoc Puente Alto
    L.marker([-33.612146, -70.575818], { icon: greenIcon }).addTo(this.map)
      .bindPopup('Duoc Puente Alto') // Pop-up para el marcador
      .openPopup(); // Abrir el pop-up automáticamente
  }  
}
