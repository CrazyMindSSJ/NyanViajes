import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { ApiService } from 'src/app/services/api.service';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  dolar: number = 0;

  persona: any;
  
  viaje = new FormGroup({
    id: new FormControl(),
    conductor: new FormControl(),
    rut_conductor: new FormControl(),
    capa_disp: new FormControl(),
    destino: new FormControl(),
    lat: new FormControl(),
    long: new FormControl(),
    dis_met: new FormControl(),
    tie_min: new FormControl(),
    estado: new FormControl('Pendiente'),
    valorDolar: new FormControl(),
    valor: new FormControl(),
    hora_salida: new FormControl(),
    pasajeros: new FormControl([]),
  });
  

  viajes: any[] = [];
  
  constructor(private fireViajes: FirebaseViajes, private router: Router, private api: ApiService) {
    
  }

  ngOnInit() {
    this.validarUsuario();
  }

  async validarUsuario() {
    this.persona = JSON.parse(localStorage.getItem("persona") || '{}');
    
  }

  ionViewWillEnter() {
    this.consumirAPI();
    this.obtenerViajes(); 
  }

  consumirAPI(){
    this.api.getDatos().dolar.subscribe((data:any)=>{
      this.dolar = data.dolar.valor;
      this.actualizarValoresDolar();
    });
  }

  actualizarValoresDolar() {
    if (this.dolar > 0) {
      this.viajes.forEach(viaje => {
        viaje.valorDolar = (viaje.valor / this.dolar).toFixed(2); // Convierte y redondea a 2 decimales
      });
    }
  }

  async obtenerViajes() {
    this.fireViajes.getViajes()
      .pipe(
        map((viajes: any[]) =>
          viajes.filter(viaje => viaje.capa_disp > 0 && viaje.estado !== "Finalizado")
        )
      )
      .subscribe(
        (viajesFiltrados) => {
          console.log("Viajes filtrados:", viajesFiltrados); // <-- Aquí inspeccionamos los datos
          this.viajes = viajesFiltrados;
          this.actualizarValoresDolar();
        },
        (error) => {
          console.error("Error obteniendo los viajes:", error);
        }
      );
  }
  
  

  irAHistorial() {
    this.router.navigate(['/mis-viajes']);
  }
}
