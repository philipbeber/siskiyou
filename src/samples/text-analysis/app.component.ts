import { Component } from "@angular/core";
import { LogAnalysisService, FileLoaderService, FileDropEvent, SettingsStorageService } from "siskiyou";
import { Filter, ColorFilter, HideFilter } from "siskiyou";
import { CustomFileLoaderService } from "./custom-file-loader";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [
    { provide: FileLoaderService, useClass: CustomFileLoaderService },
    { provide: LogAnalysisService, useClass: LogAnalysisService }
  ]
})
export class AppComponent {
  title = "app";
  colorFilter: Filter;
  hideFilter: Filter;
  noFiles = true;

  constructor(
    private logAnalysis: LogAnalysisService,
    settings: SettingsStorageService
  ) {
    this.colorFilter = settings.restoreFilter(new ColorFilter("Color"));
    logAnalysis.addFilter(this.colorFilter);
    this.hideFilter = settings.restoreFilter(new HideFilter("Hide"));
    logAnalysis.addFilter(this.hideFilter);
  }

  public dropped(event: FileDropEvent) {
    this.noFiles = false;
    let infos = [];
    for (const file of event.files) {
      file.fileEntry.file(info => {
        infos.push(info);
        if (infos.length == event.files.length) {
          this.logAnalysis.addFiles(infos);
        }
      });
    }
  }

  public keyDown(event: KeyboardEvent) {
    console.log(event.code + "/" + event.ctrlKey);
    if (event.code == "KeyH" && event.ctrlKey) {
      this.colorFilter.hideUnfiltered = !this.colorFilter.hideUnfiltered;
    }
  }
}
