import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  persona: any; // Declaramos la variable persona
  nuevoComentario: string = ''; // Para almacenar el nuevo comentario
  comentarios: string[] = []; // Array para almacenar los comentarios
  isEditing: boolean = false; // Controlar el estado de edición
  biografia: string = ''; // Biografía inicialmente vacía

  constructor(private navController: NavController) {}

  ngOnInit() {
    const personaJSON = localStorage.getItem("persona");
    this.persona = personaJSON ? JSON.parse(personaJSON) : null;
    this.biografia = 'Breve biografía del usuario o información adicional aquí.'; // Biografía por defecto
  }

  // Método para agregar un comentario
  addComment() {
    if (this.nuevoComentario.trim() !== '') {
      this.comentarios.push(this.nuevoComentario.trim()); // Agrega el nuevo comentario al array
      this.nuevoComentario = ''; // Limpia el campo de entrada
    }
  }

  // Método para alternar el estado de edición
  toggleEdit() {
    this.isEditing = !this.isEditing; // Cambia el estado de edición
    if (this.isEditing) {
      // Si entra en modo de edición, también activa el input
      setTimeout(() => {
        const input = document.querySelector('ion-input');
        if (input) {
          input.setFocus(); // Enfoca el input al entrar en modo de edición
        }
      }, 100);
    } else {
      this.saveBio(); // Guarda la biografía cuando se cierra la edición
    }
  }

  // Método para guardar la biografía al presionar Enter
  saveBio() {
    this.isEditing = false; // Finaliza la edición
    // Aquí puedes manejar el almacenamiento de la biografía si es necesario
    console.log("Biografía guardada: ", this.biografia);
  }
}






