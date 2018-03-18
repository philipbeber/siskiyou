import { NgModule } from "@angular/core";
import { MultiSelectorComponent } from "./components/multi-selector/multi-selector.component";
import { LogAnalysisService } from "./services/log-analysis.service";
import {
  ColorPickerService,
  ColorPickerDirective
} from "./components/color-picker";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FileLoaderService } from "./services/file-loader.service";
import { LogMergerService } from "./services/log-merger.service";
import { LogParserService } from "./services/log-parser.service";

@NgModule({
  declarations: [MultiSelectorComponent, ColorPickerDirective],
  exports: [MultiSelectorComponent, ColorPickerDirective],
  imports: [NgbModule, BrowserModule, FormsModule, HttpClientModule],
  providers: [FileLoaderService, LogAnalysisService, ColorPickerService, LogMergerService, LogParserService],
  bootstrap: [MultiSelectorComponent]
})
export class SiskiyouModule {}
