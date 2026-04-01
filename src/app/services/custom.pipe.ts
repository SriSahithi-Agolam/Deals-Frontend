import { Pipe, PipeTransform } from "@angular/core";
import { Text } from "./text";
 
@Pipe({
    name : 'customFormat',
    standalone : true
})
export class CustomPipe implements PipeTransform{
    constructor(private text : Text){}
    transform(value: string):string {
        return this.text.formatText(value);
    }
}
//i created custom pipe called custom format Then I created a custom pipe called customFormat.
//Instead of writing formatting logic inside the pipe, I used Dependency Injection to inject the Text service into the pipe's constructor.
//The pipe calls the service method inside transform(), which keeps the code clean, reusable, and easy to test.”