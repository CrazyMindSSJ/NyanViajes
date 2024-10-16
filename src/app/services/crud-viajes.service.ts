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
      
    };
    await this.createViaje(viaje1);
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
