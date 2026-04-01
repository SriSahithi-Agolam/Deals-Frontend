import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookComponent } from './book/book.component';

import { Routes, RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {  ReactiveFormsModule } from '@angular/forms';  


@NgModule({
  declarations: [
    AppComponent,
    BookComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 