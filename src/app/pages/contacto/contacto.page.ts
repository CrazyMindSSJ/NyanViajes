import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage {
  registeredEmails: string[] = ['usuario1@example.com', 'usuario2@example.com']; // Lista de correos registrados
  email: string = '';
  message: string = '';

  constructor() {}

  isEmailRegistered(email: string): boolean {
    return this.registeredEmails.includes(email);
  }

  sendMessage() {
    if (this.isEmailRegistered(this.email)) {
      // Lógica para enviar el mensaje
      console.log('Mensaje enviado:', this.message);
      alert('Mensaje enviado con éxito');
    } else {
      alert('El correo electrónico no está registrado. No puedes enviar un mensaje.');
    }
  }
}
