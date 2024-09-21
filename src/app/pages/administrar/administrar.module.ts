import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdministrarPageRoutingModule } from './administrar-routing.module';
import { AdministrarPage } from './administrar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdministrarPageRoutingModule
  ],
  declarations: [AdministrarPage]
})
export class AdministrarPageModule {}

