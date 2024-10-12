import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email : string = "";

  constructor(private router: Router,private crudService: CrudService) { }

  ngOnInit() {
  }

  async recuperar(){
    if(await this.crudService.recuperarUsuario(this.email)){
      alert("Revisa tu correo para encontrar la nueva contraseña!")
      this.router.navigate(['/login']);
    }else{
      alert("ERROR! el usuario no existe!")
    }
  }

}
