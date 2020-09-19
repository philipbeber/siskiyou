import { NgModule } from "@angular/core";
import { SelectorsComponent, ColorSelectorComponent, FilteredViewComponent,
  FileDropComponent, TextSelectorComponent } from "./components";
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
import { SettingsStorageService } from "./services/settings-storage.service";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    SelectorsComponent,
    ColorSelectorComponent,
    TextSelectorComponent,
    FilteredViewComponent,
    FileDropComponent,
    ColorPickerDirective
  ],
  exports: [
    SelectorsComponent,
    ColorSelectorComponent,
    TextSelectorComponent,
    FilteredViewComponent,
    FileDropComponent,
    ColorPickerDirective
  ],
  imports: [NgbModule, BrowserModule, FormsModule, HttpClientModule],
  providers: [
    FileLoaderService,
    LogAnalysisService,
    ColorPickerService,
    LogMergerService,
    LogParserService,
    SettingsStorageService
  ]
})
export class SiskiyouModule {}
