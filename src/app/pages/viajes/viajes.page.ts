import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  dolar: number = 0;

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
    estado: new FormControl('Pendiente'),
    valorDolar: new FormControl(),
    valor: new FormControl(),
    hora_salida: new FormControl(),
    pasajeros: new FormControl([]),
  });

  viajes: any[] = [];
  
  constructor(private crudViajes: CrudViajesService, private router: Router, private api: ApiService) { }

  ngOnInit() {
    //this.obtenerViajes();
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    //this.consumirAPI();
  }

  ionViewWillEnter() {
    this.consumirAPI(); // Cargar el valor del dólar al entrar a la página
    this.obtenerViajes(); // Actualizar la lista de viajes
  }

  consumirAPI(){
    this.api.getDatos().subscribe((data:any)=>{
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
    const allViajes = await this.crudViajes.getViajes();
    this.viajes = allViajes
      .filter(viaje => viaje.capa_disp > 0 && viaje.estado !== "Finalizado");
    this.actualizarValoresDolar(); // Actualizamos los valores en dólares
  }
  

  irAHistorial() {
    this.router.navigate(['/mis-viajes']);
  }
}
