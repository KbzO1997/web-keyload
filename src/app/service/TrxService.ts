import { Injectable } from '@angular/core';
import { Model } from '../model/model';
import { appsettings } from '../setting/appsettings';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class TrxService {

  private apiUrl = appsettings.apiUrl;
  constructor(private http: HttpClient) { }

  envInsertTransaction(model:Model){
    return this.http.post(`${this.apiUrl}/elementos.json`, model ).pipe(
      map((res:any)=>{
        model.documentId = res.name;
        return model;
      })
    );
  }  

  envUpdateTransaction(model:Model){
    const modelTemp={...model};
    delete modelTemp.id;
    return this.http.put(`${this.apiUrl}/elementos/${model.documentId}.json`, modelTemp);
  }

  envConsultTransaction(){
    return this.http.get(`${this.apiUrl}/elementos.json`).pipe(map(this.responseList));
  }

  envConsultIdTransaction(id:string){
    return this.http.get(`${this.apiUrl}/elementos/${id}.json`);
  }

  envDeleteTransaction(id:any){
    return this.http.delete(`${this.apiUrl}/elementos/${id}.json`);
  }

  private responseList(modelsObj:any) {    
    const models:Model[]=[];
    if (modelsObj === null) {
      return null;
    }

    for(let registro in modelsObj) {
      modelsObj[registro].documentId = registro;
      models.push(modelsObj[registro]);
    }
    return models;
  }

 
}