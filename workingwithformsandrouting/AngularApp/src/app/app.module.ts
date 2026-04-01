import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  //Implement routes for "Product Component" with path "product"
  {path: 'product', component:ProductComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
],
  imports: [
    BrowserModule,
	FormsModule,
	RouterModule.forRoot(routes)
],
  bootstrap: [AppComponent]
})


export class AppModule { }
