import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
  persona: any;

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
  });

  constructor(private navController: NavController) {}

  ngOnInit(){
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
  }

<<<<<<< HEAD
=======
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

>>>>>>> 7f0ac0096fc35dc484757afd340ae8a51d93d4a2
  logout(){
    localStorage.removeItem('persona');
    this.navController.navigateRoot('/login')
  }

  
}