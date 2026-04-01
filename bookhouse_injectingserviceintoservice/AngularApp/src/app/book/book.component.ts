import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Book } from '../Book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  books: any[]=[];
  logData: string='';
  criteria: string='Category';
  searchText: string='';
 
  constructor(private bookService: BookService) { }
 
  ngOnInit(): void {
        // fill the code
        this.logData=this.bookService.getLogData().join('\n');
  }

 
  searchBooks(){
   
// fill the code
if(this.criteria==='Book Name'){
  this.books=this.bookService.searchByBookName(this.searchText);
}
else{
  this.books=this.bookService.searchByCategory(this.searchText);
}
this.logData=this.bookService.getLogData().join('\n');

  } 

}
