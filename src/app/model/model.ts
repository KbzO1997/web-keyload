export class Model {
    id?: string;
    documentId: string;
    name: string;
    value: string;
    optional: string;
    description: string;
    
    constructor() {
      
      this.documentId ="";
      this.name ="";
      this.value ="";
      this.optional = "";
      this.description = "";      
    }  
}