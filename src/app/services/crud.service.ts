import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  //aqui podemos crear variables:
  personas: any[] = [];

  constructor() { }

  //aqui vamos a crear toda nuestra logica de programacion
  //DAO:
  public createUsuarios(persona:any):boolean{
    if( this.getUsuario(persona.rut)==undefined ){
      this.personas.push(persona);
      return true;
    }
    return false;
  }

  public getUsuario(rut:string){
    return this.personas.find(elemento=> elemento.rut == rut);
  }

  public getUsuarios():any[]{
    return this.personas;
  }

  public updateUsuarios(rut:string, nuevoUsuario:any){
    const indice = this.personas.findIndex(elemento => elemento.rut == rut);
    this.personas[indice]=nuevoUsuario;
    this.personas.push(nuevoUsuario);
    if(indice == -1){
      return false;
    }
    this.personas.splice(indice,1);
    return true;  
  }

  public deleteUsuarios(rut:string){
    const indice = this.personas.findIndex(elemento => elemento.rut == rut);
    if(indice == -1){
      return false;
    }
    this.personas.splice(indice,1);
    return true;
  }

}