  import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
  import { FirebaseViajes } from 'src/app/services/fire-viajes.service';

  @Component({
    selector: 'app-administrar-viajes',
    templateUrl: './administrar-viajes.page.html',
    styleUrls: ['./administrar-viajes.page.scss'],
  })
  export class AdministrarViajesPage implements OnInit {

    viajes: any[] = [];
    viajeSeleccionado: any = {};
    nuevoViaje = new FormGroup({
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
      console.log("se apreta el boton")
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
