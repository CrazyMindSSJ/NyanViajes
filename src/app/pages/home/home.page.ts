import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  persona: any;

  constructor(private navController: NavController) {}

  ngOnInit(){
    this.persona = JSON.parse(localStorage.getItem("persona") || '')
  }

  logout(){
    localStorage.removeItem('persona');
    this.navController.navigateRoot('/login')
  }

}


