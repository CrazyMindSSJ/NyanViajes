import { Component, OnInit } from '@angular/core';
import { CrudViajesService } from 'src/app/services/crud-viajes.service';

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

  constructor(private crudViajesService: CrudViajesService) { }

  async ngOnInit() {
    await this.cargarViajes();
  }

  async cargarViajes() {
    this.viajes = await this.crudViajesService.getViajes();
  }

  seleccionarViaje(viaje: any) {
    this.viajeSeleccionado = { ...viaje };
  }

  async actualizarViaje() {
    if (this.viajeSeleccionado) {
      const exito = await this.crudViajesService.updateViaje(this.viajeSeleccionado.id_viaje, this.viajeSeleccionado);
      if (exito) {
        alert('Viaje actualizado exitosamente');
        await this.cargarViajes();
        this.viajeSeleccionado = null;
      } else {
        alert('Error al actualizar el viaje');
      }
    }
  }

  async eliminarViaje(id_viaje: number) {
    const exito = await this.crudViajesService.deleteUsuario(id_viaje);
    if (exito) {
      alert('Viaje eliminado exitosamente');
      await this.cargarViajes();
    } else {
      alert('Error al eliminar el viaje');
    }
  }

}
