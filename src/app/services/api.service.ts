import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url_mindicador: string = "https://mindicador.cl/api";
  url_gatos: string = "https://api.thecatapi.com/v1/images/search?limit=10";
  

  constructor(private http: HttpClient) { }

  getDatos(){
    return {dolar: this.http.get(this.url_mindicador), gatos :  this.http.get(this.url_gatos)};
  }


}
