import { BrowserModule } from "@angular/platform-browser";
import { NgModule, provideZoneChangeDetection } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SiskiyouModule } from "siskiyou";

@NgModule({
  declarations: [AppComponent],
  imports: [NgbModule, BrowserModule, FormsModule, SiskiyouModule],
  providers: [provideZoneChangeDetection()],
  bootstrap: [AppComponent]
})
export class AppModule {}
