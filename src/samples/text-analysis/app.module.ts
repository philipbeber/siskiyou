import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import {
  ColorSelectorComponent,
  FileDropComponent,
  SelectorsComponent
} from "../../lib/components";
import { SiskiyouModule } from "../../lib/siskiyou.module";

@NgModule({
  declarations: [
    AppComponent,
    ColorSelectorComponent,
    FileDropComponent,
    SelectorsComponent
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
