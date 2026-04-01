import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Book } from '../Book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
 
 constructor(private bookService: BookService) { }
    isbn:string = "";
    quantity:number = 0;
 
  ngOnInit(): void {
   if(this.bookService.bookList.length>0){
    this.isbn = this.bookService.bookList[0].isbn;
   }
  }

 
  updateQuantity(){
    
    // invoke the service method and update the quantity
    this.bookService.updateQuantity(this.isbn, this.quantity);
  }

}
