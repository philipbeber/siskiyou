import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { DropdemoComponent } from "./dropdemo/dropdemo.component";
import { LogAnalysisService } from "./log-analysis.service";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileDropComponent } from './file-drop/file-drop.component';

@NgModule({
  declarations: [AppComponent, DropdemoComponent, FileDropComponent],
  imports: [NgbModule.forRoot(), BrowserModule, FormsModule, HttpClientModule],
  providers: [LogAnalysisService],
  bootstrap: [DropdemoComponent]
})
export class AppModule {}
