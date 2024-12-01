import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage {
  // Lista de usuarios registrados con correo y nombre
  registeredUsers: { name: string, email: string }[] = [
    { name: 'Usuario1', email: 'usuario1@duocuc.cl' },
    { name: 'Usuario2', email: 'usuario2@duocuc.cl' },
  ];

  email: string = '';
  name: string = '';
  message: string = '';

  constructor() {}

  // Verifica si el usuario (nombre y correo) está registrado
  isUserRegistered(name: string, email: string): boolean {
    return this.registeredUsers.some(user => user.name === name && user.email === email);
  }

  // Método para enviar el mensaje
  sendMessage() {
    // Validación de longitud del mensaje
    if (this.message.length < 10 || this.message.length > 300) {
      alert('El mensaje debe tener entre 10 y 300 caracteres.');
      return;
    }

    if (this.message.length < 10 || this.message.length > 300) {
      alert('El mensaje debe tener entre 10 y 300 caracteres.');
      return;
    }

    if (this.email.endsWith('@duocuc.cl') && this.isUserRegistered(this.name, this.email)) {
      console.log('Mensaje enviado:', this.message);
      alert('Mensaje enviado con éxito');
    } else {
      alert('El correo electrónico no está registrado.');
    }
  }
}
