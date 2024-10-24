import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CrudViajesService {

  constructor(private storage: Storage) {
    this.init();
   }

  async init(){
    await this.storage.create();
    let viaje1 = {
      "id_viaje":"1",
      "conductor":"Sebastian",
      "capa_disp":"4",
      "destino":"Tarsis 1698, Puente Alto, Región Metropolitana",
      "lat":"-33.59442060239603",
      "long":"-70.55584509878297",
      "dis_met":"3000",
      "tie_min":"9",
      "estado":"Pendiente",
      "pasajeros":""
    };
    let viaje2 = {
      "id_viaje":"2",
      "conductor":"Sebastian",
      "capa_disp":"0",
      "destino":"Tarsis 1698, Puente Alto, Región Metropolitana",
      "lat":"-33.59442060239603",
      "long":"-70.55584509878297",
      "dis_met":"3000",
      "tie_min":"9",
      "estado":"Finalizado",
      "pasajeros":""
    }
    let viaje3 = {
      "id_viaje":"3",
      "conductor":"Sebastian",
      "capa_disp":"1",
      "destino":"Tongoy 1002, La Pintana, Región Metropolitana",
      "lat":"-33.580451215803116",
      "long":"-70.64769204356487",
      "dis_met":"9743",
      "tie_min":"17",
      "estado":"En Curso",
      "pasajeros":""
    };
    await this.createViaje(viaje1);
    await this.createViaje(viaje2);
    await this.createViaje(viaje3);
  }

  //DAO
  public async createViaje(viaje:any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    if(viajes.find(via=>via.id_viaje==viaje.id_viaje)!=undefined){
      return false;
    }
    viajes.push(viaje);
    await this.storage.set("viajes",viajes);
    return true;
  }

  public async getViaje(id_viaje:number): Promise<any>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(via=>via.id_viaje==id_viaje);
  }

  public async getViajes():Promise<any[]>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id_viaje:number, nuevoViaje:any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(via=>via.id_viaje == id_viaje);
    if(indice == -1){
      return false;
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes",viajes);
    return true;
  }

  public async deleteUsuario(id_viaje:number): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(via=>via.id_viaje == id_viaje);
    if(indice == -1){
      return false;
    }
    viajes.splice(indice,1);
    await this.storage.set("viajes",viajes);
    return true;
  }

}
