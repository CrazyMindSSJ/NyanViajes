import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
  persona: any;
  clima: string = '';


  constructor(private navController: NavController, private api: ApiService) {}

  ngOnInit(){
    this.persona = JSON.parse(localStorage.getItem("persona") || '');
    this.consumirAPI();
  }

  logout(){
    localStorage.removeItem('persona');
    this.navController.navigateRoot('/login')
  }

  consumirAPI(){
    this.api.getDatos().clima.subscribe((data:any)=>{
      this.clima = data.temperature; 
    });
  }
}