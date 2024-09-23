import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  // Aquí podemos crear variables:
  personas: any[] = [
    {
      rut: '12345678-9', 
      nombre: 'Admin',
      fecha_nacimiento: '2000-01-01',
      genero: 'Masculino',
      email: 'admin@duocuc.cl',
      contra: 'admin1234',
      contraVali: 'admin1234',
      tiene_auto: 'No',
      modelo: '',
      marca: '',
      color: '',
      cant_asiento: '',
      patente: '',
      categoria: 'Administrador',
      isAdmin: true 
    }
  ];

  constructor() { }

  // Aquí vamos a crear toda nuestra lógica de programación
  // DAO:
  public createUsuarios(persona: any): boolean {
    if (this.getUsuario(persona.rut) == undefined) {
      this.personas.push(persona);
      return true;
    }
    return false;
  }

  public getUsuario(rut: string) {
    return this.personas.find(elemento => elemento.rut === rut);
  }

  public getUsuarios(): any[] {
    return this.personas;
  }

  public validarUsuario(email: string, contra: string) {
    // Método para validar el usuario con email y contraseña
    return this.personas.find(usuario => usuario.email === email && usuario.contra === contra);
  }

  public updateUsuarios(rut: string, nuevoUsuario: any) {
    const indice = this.personas.findIndex(elemento => elemento.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.personas[indice] = nuevoUsuario;
    return true;
  }

  public deleteUsuarios(rut: string) {
    const indice = this.personas.findIndex(elemento => elemento.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.personas.splice(indice, 1);
    return true;
  }
}
