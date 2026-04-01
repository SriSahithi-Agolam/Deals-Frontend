import {Pipe, PipeTransform} from '@angular/core';

//Implement your Code here
@Pipe({
   name: 'length'
   })

export class ShowLen  {
   //Implement your Code here
   transform(value: string) :number{
      return value.length;
   }
}