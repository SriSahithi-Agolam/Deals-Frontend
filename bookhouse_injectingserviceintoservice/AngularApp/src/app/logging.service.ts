// import { Injectable } from '@angular/core';
import { Injectable ,EventEmitter} from '@angular/core';
// import { EventEmitter } from 'stream';
import { Book } from './Book';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
logData:Array<string>=[];
  constructor() { }

insertLogData(data:string){
   // Fill the code
   this.logData.unshift(data);
}

}
