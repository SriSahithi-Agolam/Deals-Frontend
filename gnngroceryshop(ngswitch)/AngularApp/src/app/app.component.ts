import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'GNN Grocery Shop';

  search:string = "";
  fruits:string[]=['Select Fruits','Apple','Banana','Grapes','Guava'];
  vegetables:string[]=['Select Vegetables','Carrot','Beetroot','Potato','Mushroom'];
  meat:string[]=['Select Meat','Chicken','Goat','Beef','Pork'];
}

