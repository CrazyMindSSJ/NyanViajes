import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { AlertController } from '@ionic/angular';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';

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
    rut_conductor: new FormControl(),
    capa_disp: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),
    lat: new FormControl('', [Validators.required]),
    long: new FormControl('', [Validators.required]),
    dis_met: new FormControl('', [Validators.required]),
    tie_min: new FormControl('', [Validators.required]),
    estado: new FormControl('Pendiente'),
    valor: new FormControl('', [Validators.required]),
    hora_salida: new FormControl('', Validators.required),
    pasajeros: new FormControl([]),
  });

  constructor(
    private firebase: FirebaseViajes,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem('persona') || '{}');
    this.viaje.controls.conductor.setValue(this.persona.nombre);
    this.viaje.controls.rut_conductor.setValue(this.persona.rut);
    this.initMap();
  }

  public async registrar() {
    if (this.viaje.invalid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos obligatorios.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    const confirmAlert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Seguro quieres realizar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Registro de viaje cancelado');
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            const viajeData = this.viaje.value;
            const resultado = await this.firebase.crearViaje(viajeData, this.persona.rut);

            if (resultado) {
              const successAlert = await this.alertController.create({
                header: 'Viaje creado',
                message: 'Viaje generado con éxito',
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.router.navigate(['home/viajes']).then(() => {
                        window.location.reload();
                      });
                    },
                  },
                ],
              });
              await successAlert.present();
            } else {
              console.error('Error al registrar el viaje. Asegúrese de que el conductor exista.');
            }
          },
        },
      ],
    });

    await confirmAlert.present();
  }

  ngAfterViewInit() {}

  initMap() {
    this.map = L.map('map_html').locate({ setView: true, maxZoom: 16 });
    const puntoOrigen = L.latLng(-33.59844040672239, -70.57881148451541); 

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map!);

    this.geocoder = G.geocoder({
      placeholder: 'Ingrese dirección a buscar',
      errorMessage: 'Dirección no encontrada',
    }).addTo(this.map!);

    this.map.on('locationfound', (e: L.LocationEvent) => {
      this.viaje.controls.lat.setValue(e.latlng.lat.toString());
      this.viaje.controls.long.setValue(e.latlng.lng.toString());
    });

    let routeControl: L.Routing.Control | undefined;
    this.geocoder.on('markgeocode', (e: any) => {
      const destinationLatLng = e.geocode.center;
      const destinationName = e.geocode.name;
    
      this.viaje.controls.destino.setValue(destinationName);
    
      const lat = parseFloat(this.viaje.controls.lat.value || '0');
      const long = parseFloat(this.viaje.controls.long.value || '0');
    
      if (isNaN(lat) || isNaN(long)) {
        console.error('Latitud o longitud inválida.');
        return;
      }
    
      if (this.map) {
        if (routeControl) {
          this.map.removeControl(routeControl);
        }
    
        routeControl = L.Routing.control({
          waypoints: [
            puntoOrigen,
            destinationLatLng,
          ],
          fitSelectedRoutes: true,
          addWaypoints: false,
        })
          .on('routesfound', (e: any) => {
            const route = e.routes[0];
            if (route && route.summary) {
              this.viaje.controls.dis_met.setValue(route.summary.totalDistance.toString());
              this.viaje.controls.tie_min.setValue(Math.round(route.summary.totalTime / 60).toString());
            } else {
              console.error('No se pudo calcular la distancia o el tiempo.');
            }
          })
          .addTo(this.map!);
      }
    });
  }
}
