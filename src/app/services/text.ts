import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Text {
  formatText(value: string): string {
        return value.trim().toUpperCase();
    }
}
//simple service called text and reusable method called formattext()