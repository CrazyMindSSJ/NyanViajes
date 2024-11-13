import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class CrudViajesService {

  private currentId = 4;
  private rutConductor = '';

  constructor(private storage: Storage, private crudUsuarios: CrudService) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const savedViajes = await this.storage.get('viajes');
      if (!savedViajes || savedViajes.length === 0) {
      let rutConductor = '21241316-k';
      let viaje1 = {
        "capa_disp": "4",
        "destino": "Tarsis 1698, Puente Alto, Región Metropolitana",
        "lat": "-33.59442060239603",
        "long": "-70.55584509878297",
        "dis_met": "3000",
        "tie_min": "9",
        "estado": "Pendiente",
        "valor": "3000",
        "hora_salida":"19:00",
        "pasajeros": []
      };
      
      let viaje2 = {
        "capa_disp": "0",
        "destino": "Tarsis 1698, Puente Alto, Región Metropolitana",
        "lat": "-33.59442060239603",
        "long": "-70.55584509878297",
        "dis_met": "3000",
        "tie_min": "9",
        "estado": "Finalizado",
        "valor": "3000",
        "hora_salida":"20:00",
        "pasajeros": []
      };
  
      await this.createViaje(viaje1, rutConductor);
      await this.createViaje(viaje2, rutConductor);
  
      await this.storage.set('viajes', [viaje1, viaje2]);
    }
  }
  

  // DAO
  public async createViaje(viaje: any, rutConductor: string): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    
    const conductor = await this.crudUsuarios.getUsuario(rutConductor);
    if (!conductor) {
        return false; 
    }
  
    viaje.conductor = conductor.nombre; 

    viaje.id_viaje = await this.generateAutoIncrementId(); 
    
    if (typeof viaje.id_viaje !== 'number' || isNaN(viaje.id_viaje)) {
        console.error("El ID generado no es un número:", viaje.id_viaje);
        return false;
    }

    viajes.push(viaje);

    await this.storage.set("viajes", viajes);
    return true;
}





  public async getViaje(id_viaje: number): Promise<any> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let viaje = viajes.find(via => via.id_viaje == id_viaje);
    
    if (viaje) {
      viaje.pasajerosNombres = await Promise.all(
        viaje.pasajeros.map(async (rut: string) => {
          let usuario = await this.crudUsuarios.getUsuario(rut);
          return usuario ? usuario.nombre : 'Desconocido';
        })
      );
    } else {
      viaje = {
        pasajeros: [],
        pasajerosNombres: []
      };
    }
  
    return viaje; 
  }
  

  public async getViajes(): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id_viaje: number, nuevoViaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(via => via.id_viaje == id_viaje);
    if (indice == -1) {
      return false;
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async deleteUsuario(id_viaje: number): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(via => via.id_viaje == id_viaje);
    if (indice == -1) {
      return false;
    }
    viajes.splice(indice, 1);
    await this.storage.set("viajes", viajes);
    return true;
  }

  private async generateAutoIncrementId(): Promise<number> {
    const viajes: any[] = await this.storage.get("viajes") || [];
    const maxId = viajes.reduce((max, viaje) => Math.max(max, viaje.id_viaje ? Number(viaje.id_viaje) : 0), 0);
    this.currentId = maxId + 1;
    return this.currentId; 
}


  public async tomarViaje(id_viaje: number, rut: string): Promise<boolean> {
    let viaje = await this.getViaje(id_viaje);
    if (!viaje || viaje.capa_disp <= 0 || viaje.pasajeros.includes(rut)) return false;

    viaje.pasajeros.push(rut);
    viaje.capa_disp--;
    await this.updateViaje(id_viaje, viaje);
    return true;
  }

  public async salirViaje(id_viaje: number, rut: string): Promise<boolean> {
    let viaje = await this.getViaje(id_viaje);
  
    if (!viaje || !viaje.pasajeros.includes(rut)) return false;
  
    viaje.pasajeros = viaje.pasajeros.filter((pasajero: string) => pasajero !== rut);
    viaje.capa_disp++;
      await this.updateViaje(id_viaje, viaje);
    return true;
  }
  

  public async cambiarEstadoViaje(id_viaje: number): Promise<boolean> {
    let viaje = await this.getViaje(id_viaje);
    if (!viaje) return false;

    switch (viaje.estado) {
        case "Pendiente":
            viaje.estado = "En Curso";
            break;
        case "En Curso":
            viaje.estado = "Finalizado";
            break;
        default:
            return false;
    }

    await this.updateViaje(id_viaje, viaje);
    return true;
  }

  public async esConductorDelViaje(id_viaje: number, rut: string): Promise<boolean> {
    const viaje = await this.getViaje(id_viaje);
    return viaje && viaje.conductor === rut; 
  }
  public async getHistorialViajes(): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.filter(viaje => viaje.estado === "Finalizado");
  }
}
