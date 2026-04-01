import { Component, OnInit} from '@angular/core';
//ADD REQUIRED IMPORTS
import { Product } from '../product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
   
   
   //Declare variable "model" to store object of "Product" model 
   model:Product=new Product('', '' , 0);
  
   //Declare "prodList" array variable
   prodList:Product[]=[];
   //Implement code here
   addProduct(){
    this.prodList.push(new Product(this.model.code, this.model.name, this.model.price));
   }
   deleteProduct(productToDelete:Product){
    this.prodList=this.prodList.filter(product=>product!==productToDelete);
   }
}
	 	  	    	 	      	  	 	
