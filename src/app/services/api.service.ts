import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url_mindicador: string = "https://mindicador.cl/api";

  constructor(private http: HttpClient) { }

  getDatos(){
    return this.http.get(this.url_mindicador);
  }
}
