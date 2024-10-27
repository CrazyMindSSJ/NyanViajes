import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private storage: Storage) {
    this.init();
   }

  async init(){
    await this.storage.create();
    let admin = {
      "rut": '12345678-9', 
      "nombre": 'Alan',
      "fecha_nacimiento": '2000-01-01',
      "genero": 'Masculino',
      "email": 'admin@duocuc.cl',
      "contra": 'admin1234',
      "contraVali": 'admin1234',
      "tiene_auto": 'No',
      "modelo": '',
      "marca": '',
      "color": '',
      "cant_asiento": '',
      "patente": '',
      "categoria": 'Administrador'
    };
    let usu1 = {
      "rut": '21241316-k', 
      "nombre": 'Sebastian Urrutia',
      "fecha_nacimiento": '2003-16-03',
      "genero": 'Masculino',
      "email": 'seba@duocuc.cl',
      "contra": 'Seba123.',
      "contraVali": 'Seba123.',
      "tiene_auto": 'Si',
      "modelo": 'GTR-34',
      "marca": 'Nissan',
      "color": 'Plateado',
      "cant_asiento": '4',
      "patente": 'XDGG13',
      "categoria": 'Estudiante'
    };
    let usu2 = {
      "rut": '21392915-1', 
      "nombre": 'Betzabe Ruiz',
      "fecha_nacimiento": '2003-09-08',
      "genero": 'Femenino',
      "email": 'betsa@duocuc.cl',
      "contra": 'Bets123.',
      "contraVali": 'Bets123.',
      "tiene_auto": 'No',
      "modelo": '',
      "marca": '',
      "color": '',
      "cant_asiento": '',
      "patente": '',
      "categoria": 'Estudiante'
    };
    await this.createUsuario(admin);
    await this.createUsuario(usu1);
    await this.createUsuario(usu2);
  }
  // Aquí vamos a crear toda nuestra lógica de programación
  // DAO:
  public async createUsuario(persona: any): Promise<boolean> {
    let personas: any[] = await this.storage.get("personas") || [];
    if (personas.find(per=>per.rut==persona.rut)!=undefined) {
      return false;
    }
    personas.push(persona);
    await this.storage.set("personas",personas);
    return true;
  }

  public async getUsuario(rut: string): Promise<any> {
    let personas: any[] = await this.storage.get("personas") || [];
    return personas.find(per => per.rut==rut);
  }

  public async getUsuarios(): Promise<any[]> {
    let personas: any[] = await this.storage.get("personas") || [];
    return personas;
  }

  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean> {
    let personas: any[] = await this.storage.get("personas") || [];
    let indice: number = personas.findIndex(per=>per.rut==rut);
    if (indice === -1) {
      return false;
    }
    personas[indice] = nuevoUsuario;
    await this.storage.set("personas",personas);
    return true;
  }

  public async deleteUsuario(rut: string): Promise <boolean> {
    let personas: any[] = await this.storage.get("personas") || [];
    let indice: number = personas.findIndex(per=>per.rut==rut);
    if (indice === -1) {
      return false;
    }
    personas.splice(indice,1);
    await this.storage.set("personas",personas);
    return true;
  }

  public async login (email: string, contra: string) {
    let personas: any[] = await this.storage.get("personas") || [];
    const per = personas.find(element => element.email == email  && element.contra == contra);
    if(per){
      localStorage.setItem("persona",JSON.stringify(per));
      return true;
    }
    return false;
  }

  public async recuperarUsuario (email: string): Promise <any> {
    let personas: any[] = await this.storage.get("personas") || [];
    return personas.find(element => element.email == email);
  }
}
