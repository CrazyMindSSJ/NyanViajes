import { Component, OnInit } from '@angular/core';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';

@Component({
  selector: 'app-administrar-viajes',
  templateUrl: './administrar-viajes.page.html',
  styleUrls: ['./administrar-viajes.page.scss'],
})
export class AdministrarViajesPage implements OnInit {

  viajes: any[] = [];
  viajeSeleccionado: any = null;
  nuevoViaje: any = {
    capa_disp: '',
    destino: '',
    lat: '',
    long: '',
    dis_met: '',
    tie_min: '',
    estado: 'Pendiente',
    valor: '',
    hora_salida: '',
    pasajeros: []
  };

  viaje: any;

  constructor(private fireViajes: FirebaseViajes) { }

   ngOnInit() {
     this.cargarViajes();
  }

   cargarViajes() {
   this.fireViajes.getViajes();
  }

  seleccionarViaje(viaje: any) {
    this.viajeSeleccionado = { ...viaje };
  }

  async actualizarViaje() {
    this.fireViajes.updateViaje(this.nuevoViaje.value).then(()=>{
      alert("Viaje modificado!");
      this.viajeSeleccionado.reset();
    }).catch(error=>{
      console.log("ERROR: "+ error)
    })
  }

  eliminarViaje(id_viaje: string) {
   this.fireViajes.deleteViaje(id_viaje);
    
  }

}
