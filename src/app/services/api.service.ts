import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url_mindicador: string = "https://mindicador.cl/api";
  url_clima : string = "https://goweather.herokuapp.com/weather/Puente_Alto"
  

  constructor(private http: HttpClient) { }

  getDatos(){
    return {dolar: this.http.get(this.url_mindicador), clima: this.http.get(this.url_clima)};
  }


}
