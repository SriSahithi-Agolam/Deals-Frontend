import { Injectable ,EventEmitter} from '@angular/core';
// import { EventEmitter } from 'stream';
import { Book } from './Book';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class BookService {

 
 
   bookList:Array<any>=[
    { isbn: "ISBN 1-455-67895-1", bookName: "The Night Fire", category: "Mystery",price:750, quantity:20},           ​
    { isbn: "ISBN 7-555-07885-4", bookName: "The last bow", category: "Mystery",price:1750, quantity:50},
    { isbn: "ISBN 2-655-90795-5", bookName: "Good calories", category: "Health",price:1250, quantity:10},
    { isbn: "ISBN 7-555-07885-4", bookName: "Healing power", category: "Health",price:899, quantity:25},
    { isbn: "ISBN 9-055-32795-9", bookName: "Born to run", category: "Fitness",price:550, quantity:15},
    { isbn: "ISBN 9-185-11795-0", bookName: "Spark", category: "Fitness",price:1999, quantity:35}
   ];
  

  constructor(private loggingService:LoggingService) { }
 
  
  searchByBookName(bookName:string):Array<any>{
     // Fill the code
     const result=this.bookList.filter(book=>book.bookName.toLowerCase().includes(bookName.toLowerCase()));
     this.loggingService.insertLogData(`Books with name ${bookName} viewed by user`);
return result;
  }

  searchByCategory(category:string):Array<any>{

    // Fill the code
    const result=this.bookList.filter(book=>book.category.toLowerCase()===category.toLowerCase());
    this.loggingService.insertLogData(`Books with category ${category} viewed by user`);
    return result;
  }

  getLogData():Array<string>{
     // Fill the code
     return this.loggingService.logData;
  }
}
