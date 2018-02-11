import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 
import { AppComponent } from './app.component';
import { FileDropModule } from 'ngx-file-drop';
import { DropdemoComponent } from './dropdemo/dropdemo.component';
 
 
@NgModule({
  declarations: [
    AppComponent,
    DropdemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FileDropModule
  ],
  providers: [],
  bootstrap: [DropdemoComponent]
})
export class AppModule { }