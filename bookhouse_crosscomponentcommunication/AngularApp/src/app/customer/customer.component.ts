import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
books: Array<any>=[];
  constructor(private bookService: BookService) { }

    status:string='';
  ngOnInit(): void {
  
  // Fill the code
  this.display();
  }

    display(){
      this.books=this.bookService.getBooks();
      this.bookService.statusUpdate.subscribe((status:string)=>{
        this.status = status;
      });
     
    }

}
