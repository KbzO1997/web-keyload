import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Model } from './model/model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Utilidad } from './setting/utilidad';
import { TrxService } from './service/TrxService';
      

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DecimalPipe, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})

export class AppComponent implements  OnInit   {
  currentYear: number = new Date().getFullYear();
  descipcion: string = ""; 
  
  //private modal = inject(NgbModal);
	util = new Utilidad();
  paginatedList: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  
  list : Model[] = [];
  listMes: any[] = [];
  elemento: Model = new Model();

  isUpdate: boolean = true;
  mostrarRegistro: boolean = false;
   
  constructor(private _service: TrxService) {}

  ngOnInit () {    
    this.petticionConsult(); 
  }

  isViewRegistro(){
    this.mostrarRegistro = (this.mostrarRegistro) ? false : true;
  }
  
  btnEnvRequestUpdate(model: any) {
    this.elemento = { ...model };
    this.isUpdate = false;
  }

  btnEnvRequest() {
    if(this.isUpdate){
      this._service.envInsertTransaction(this.elemento).subscribe(res=>{alert('OK'); this.petticionConsult();});
    }else{      
      this._service.envUpdateTransaction(this.elemento).subscribe(res=>{alert('OK'); this.petticionConsult();});
    }   
    this.limpiar(); 
  }

  btnEnvRequestDelete(id: string) {    
    this._service.envDeleteTransaction(id).subscribe(res=>{alert('OK'); this.petticionConsult();});
  }

  petticionConsult(){
    this._service.envConsultTransaction().subscribe((res:any)=>{      
      this.list = res;
      this.updatePaginatedList();
    });    
  }
  
  /*  PROCESS TABLE  */
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.list.slice(startIndex, endIndex);
    return this.paginatedList;
  }

  nextPage() {
      if ((this.currentPage * this.itemsPerPage) < this.list.length) {
        this.currentPage++;
        this.updatePaginatedList();
      }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }
  /*  PROCESS TABLE  */

  limpiar() {
    this.elemento.name ="";
    this.elemento.value ="";
    this.elemento.optional = "";
    this.elemento.description = "";      
  }

  copyToClipboard(model: any) {
    const textarea = document.createElement('textarea');
    textarea.value = model.value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea); 
  }

  btnGenerateDownloadJSON() {
    const nombreArchivo = 'ReporteDegastos.json';

    // Transformar los datos para incluir "id" y "total"
    const elementosTransformados: { [key: string]: any } = {};
    
    for (const [id, elemento] of Object.entries(this.list)) {
      elementosTransformados[elemento.documentId] = {
        ...elemento
      };
    }

    const datos = JSON.stringify({ elementos: elementosTransformados }, null, 2);
    const blob = new Blob([datos], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}