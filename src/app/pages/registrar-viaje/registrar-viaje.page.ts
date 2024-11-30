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

  constructor(private firebase: FirebaseViajes, private router: Router, private navController: NavController, private alertController: AlertController) { }

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    this.viaje.controls.conductor.setValue(this.persona.nombre);
    this.initMap();
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
    
  }

  initMap() {
    this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });

    const normalTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    normalTileLayer.addTo(this.map!); // Aseguramos que `this.map` no sea undefined

    this.map.on('locationfound', (e: L.LocationEvent) => {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
    });

    this.geocoder = G.geocoder({
        placeholder: "Ingrese dirección a buscar",
        errorMessage: "Dirección no encontrada"
    }).addTo(this.map!); // Aseguramos que `this.map` no sea undefined

    let routeControl: L.Routing.Control | undefined;
    let closeButton: HTMLButtonElement | undefined;
    let routeLayers: L.LayerGroup | undefined; // Grupo para las líneas de ruta
    let markerStart: L.Marker | undefined; // Marcador del inicio
    let markerEnd: L.Marker | undefined; // Marcador del fin

    // Define los colores para los segmentos
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];

    this.geocoder.on('markgeocode', (e: any) => {
        let lat = e.geocode.properties['lat'];
        let lon = e.geocode.properties['lon'];

        this.viaje.controls.destino.setValue(e.geocode.properties['display_name']);
        this.viaje.controls.lat.setValue(lat);
        this.viaje.controls.long.setValue(lon);

        if (this.map) {
            if (routeControl) {
                this.map.removeControl(routeControl);
                routeControl = undefined;
            }
            if (closeButton) {
                closeButton.remove();
                closeButton = undefined;
            }
            if (routeLayers) {
                this.map.removeLayer(routeLayers);
                routeLayers = undefined;
            }

            // Crear grupo de capas para manejar los segmentos de la ruta
            routeLayers = L.layerGroup().addTo(this.map!);

            // Crear control de rutas sin estilo predeterminado
            routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(-33.59844040672239, -70.57881148451541),
                    L.latLng(lat, lon)
                ],
                fitSelectedRoutes: true,
                addWaypoints: false, // Evita marcadores intermedios
                lineOptions: {
                    styles: [{ color: 'transparent', weight: 0 }], // Oculta la línea predeterminada
                    extendToWaypoints: true, // Extiende la ruta hasta los waypoints
                    missingRouteTolerance: 1, // Tolerancia para rutas faltantes
                }
            }).on('routesfound', (e: any) => {
                const route = e.routes[0];
                const colorCount = colors.length;

                // Dibujar segmentos de la ruta con diferentes colores
                for (let i = 0; i < route.coordinates.length - 1; i++) {
                    const start = route.coordinates[i];
                    const end = route.coordinates[i + 1];
                    const color = colors[i % colorCount]; // Seleccionar color cíclico

                    // Dibujar segmento como una línea recta y añadirlo al grupo
                    L.polyline([start, end], {
                        color: color,
                        weight: 6, // Grosor de la línea
                        opacity: 1, // Opacidad sólida
                    }).addTo(routeLayers!);
                }

                // Crear marcadores de inicio y fin
                markerStart = L.marker(route.coordinates[0]).addTo(this.map!);
                markerEnd = L.marker(route.coordinates[route.coordinates.length - 1]).addTo(this.map!);

                this.viaje.controls.dis_met.setValue(route.summary.totalDistance);
                this.viaje.controls.tie_min.setValue(Math.round(route.summary.totalTime / 60));
            }).addTo(this.map!);

            closeButton = L.DomUtil.create('button', 'close-button') as HTMLButtonElement;
            closeButton.innerHTML = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.zIndex = '1000';
            closeButton.onclick = () => {
                // Eliminar ruta, marcadores y botón
                if (routeControl) {
                    this.map?.removeControl(routeControl);
                    routeControl = undefined;
                }
                if (routeLayers) {
                    this.map?.removeLayer(routeLayers);
                    routeLayers = undefined;
                }
                if (markerStart) {
                    this.map?.removeLayer(markerStart);
                    markerStart = undefined;
                }
                if (markerEnd) {
                    this.map?.removeLayer(markerEnd);
                    markerEnd = undefined;
                }
                if (closeButton) {
                    closeButton.remove();
                    closeButton = undefined;
                }
                this.map?.setView([-33.59844040672239, -70.57881148451541], 16);
            };

            this.map.getContainer()?.appendChild(closeButton);
        }
    });

    // Crear botón para alternar entre modos claro y oscuro
    const modeToggleButton = L.DomUtil.create('button', 'mode-toggle-button') as HTMLButtonElement;
    modeToggleButton.innerHTML = `<i class="icon"></i> Modo Claro`;
    modeToggleButton.style.position = 'absolute';
    modeToggleButton.style.top = '80px';
    modeToggleButton.style.left = '10px';
    modeToggleButton.style.zIndex = '1000';

    // Estilo del botón
    modeToggleButton.style.background = '#fff';
    modeToggleButton.style.border = 'none';
    modeToggleButton.style.padding = '5px 10px';
    modeToggleButton.style.cursor = 'pointer';
    modeToggleButton.style.borderRadius = '5px';
    modeToggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

    modeToggleButton.onclick = () => {
        if (this.map) {
            if (this.map.hasLayer(normalTileLayer)) {
                this.map.removeLayer(normalTileLayer);
                this.map.addLayer(darkTileLayer);
                modeToggleButton.innerHTML = `<i class="icon"></i> Modo Claro`; // Cambia el texto a "Modo Claro"
            } else {
                this.map.removeLayer(darkTileLayer);
                this.map.addLayer(normalTileLayer);
                modeToggleButton.innerHTML = `<i class="icon"></i> Modo Oscuro`; // Cambia el texto a "Modo Oscuro"
            }
        }
    };

    this.map?.getContainer()?.appendChild(modeToggleButton);
}
 
}
