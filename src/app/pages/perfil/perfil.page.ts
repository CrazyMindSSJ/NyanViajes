import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  persona: any;
  nuevoComentario: string = '';
  comentarios: { usuario: string; texto: string }[] = [];
  isEditing: boolean = false;
  biografia: string = '';
  viajesHistorial: { destino: string; fecha: Date }[] = []; 
  nuevoViaje: string = ''; 

  constructor(private navController: NavController, private api: ApiService) {}

  ngOnInit() {
    const personaJSON = localStorage.getItem("persona");
    this.persona = personaJSON ? JSON.parse(personaJSON) : { nombre: 'Usuario', categoria: 'General' };
    this.biografia = localStorage.getItem("biografia") || 'Escribe tu biografía aqui';
  }

  // Método para agregar un comentario con el nombre del usuario
  addComment() {
    if (this.nuevoComentario.trim() !== '') {
      this.comentarios.push({ usuario: this.persona.nombre, texto: this.nuevoComentario.trim() });
      this.nuevoComentario = '';
    }
  }

  // Alternar el estado de edición
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      setTimeout(() => {
        const input = document.querySelector('ion-input');
        if (input) {
          input.setFocus();
        }
      }, 100);
    } else {
      this.saveBio(); // Guardar biografía al salir de la edición
      this.saveName(); // Guardar nombre
    }
  }

  // Guardar el nombre
  saveName() {
    localStorage.setItem('persona', JSON.stringify(this.persona));
    console.log("Nombre guardado: ", this.persona.nombre);
  }

  // Guardar la biografía
  saveBio() {
    localStorage.setItem('biografia', this.biografia);
    console.log("Biografía guardada: ", this.biografia);
  }

  // Método para agregar un viaje al historial
  finalizarViaje() {
    if (this.nuevoViaje.trim() !== '') {
      this.viajesHistorial.push({ destino: this.nuevoViaje, fecha: new Date() });
      this.nuevoViaje = ''; 
    }
  }
}
