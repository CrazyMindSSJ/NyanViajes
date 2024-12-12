import { Component, OnInit } from '@angular/core';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';

@Component({
  selector: 'app-administrar-viajes',
  templateUrl: './administrar-viajes.page.html',
  styleUrls: ['./administrar-viajes.page.scss'],
})
export class AdministrarViajesPage implements OnInit {

  viajes: any[] = [];
  viajeSeleccionado: any = {};
  nuevoViaje: any = {
    capa_disp: '',
    conductor: '',
    destino: '',
    dis_met: '',
    estado: 'Pendiente',
    hora_salida: '',
    id: '',
    lat: '',
    long: '',
    pasajeros: [],
    tie_min: '',
    valor: ''
  };

  viaje: any;

  constructor(private fireViajes: FirebaseViajes) { }

   ngOnInit() {
     this.cargarViajes();
  }

  cargarViajes() {
    this.fireViajes.getViajes().subscribe(
      (data: any[]) => {
        this.viajes = data.map(viaje => ({
          capa_disp: viaje.capa_disp || 'No disponible',
          destino: viaje.destino || 'Sin destino',
          estado: viaje.estado || 'Pendiente',
          ...viaje // Conserva otras propiedades
        }));
        console.log('Viajes cargados:', this.viajes);
      },
      (error) => {
        console.error('Error al cargar los viajes:', error);
      }
    );
  }

  seleccionarViaje(viaje: any) {
    this.viajeSeleccionado = { ...viaje };
  }

  async actualizarViaje() {
    if (this.viajeSeleccionado) {
      try {
        await this.fireViajes.updateViaje(this.viajeSeleccionado);
        alert("Viaje modificado!");
        this.viajeSeleccionado = null; 
        this.cargarViajes();
      } catch (error) {
        console.error("ERROR:", error);
      }
    } else {
      alert("No hay viaje seleccionado.");
    }
  }
  

  eliminarViaje(id_viaje: string) {
   this.fireViajes.deleteViaje(id_viaje);
    
  }

}
