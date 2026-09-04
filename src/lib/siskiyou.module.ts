import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import {
  SelectorsComponent,
  ColorSelectorComponent,
  FilteredViewComponent,
  FileDropComponent,
  TextSelectorComponent
} from "./components";
import { LogAnalysisService } from "./services/log-analysis.service";
import { ColorPickerModule } from "./components/color-picker";
import { FileLoaderService } from "./services/file-loader.service";
import { LogMergerService } from "./services/log-merger.service";
import { LogParserService } from "./services/log-parser.service";
import { SettingsStorageService } from "./services/settings-storage.service";

@NgModule({
  declarations: [
    SelectorsComponent,
    ColorSelectorComponent,
    TextSelectorComponent,
    FilteredViewComponent,
    FileDropComponent
  ],
  exports: [
    SelectorsComponent,
    ColorSelectorComponent,
    TextSelectorComponent,
    FilteredViewComponent,
    FileDropComponent
  ],
  imports: [NgbModule, CommonModule, FormsModule, ColorPickerModule],
  providers: [
    FileLoaderService,
    LogAnalysisService,
    LogMergerService,
    LogParserService,
    SettingsStorageService
  ]
})
export class SiskiyouModule {}
