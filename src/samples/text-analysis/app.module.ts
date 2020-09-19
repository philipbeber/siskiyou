import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SiskiyouModule } from "siskiyou";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SiskiyouModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
