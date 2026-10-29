import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { take } from "rxjs/operators";
import {
  LogAnalysisService,
  FileLoaderService,
  FileDropEvent,
  SettingsStorageService,
  ColorSelectorComponent,
} from "siskiyou";
import { Filter, ColorFilter, HideFilter, FileFilter } from "siskiyou";
import { CustomFileLoaderService } from "./custom-file-loader";
import { createLargeLogFile } from "../../lib/testing/large-log.fixture";

@Component({
  standalone: false,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [
    { provide: FileLoaderService, useClass: CustomFileLoaderService },
    { provide: LogAnalysisService, useClass: LogAnalysisService },
  ],
})
export class AppComponent implements OnInit {
  title = "app";
  colorFilter: ColorFilter;
  hideFilter: Filter;
  fileFilter: FileFilter;
  noFiles = true;
  noLines = false;
  loadingDemo = false;

  constructor(
    private logAnalysis: LogAnalysisService,
    settings: SettingsStorageService,
  ) {
    this.colorFilter = new ColorFilter("Color");
    settings.restoreFilter(this.colorFilter);
    logAnalysis.addFilter(this.colorFilter);
    this.hideFilter = settings.restoreFilter(new HideFilter("Hide"));
    logAnalysis.addFilter(this.hideFilter);
    this.fileFilter = new FileFilter("Files");
    logAnalysis.addFilter(this.fileFilter);
    logAnalysis.fileAdded.subscribe((file) =>
      this.fileFilter.addFileItem(file),
    );
  }

  ngOnInit() {
    if (new URLSearchParams(window.location.search).has("largeFile")) {
      this.loadLargeDemo();
    }
  }

  public loadLargeDemo() {
    if (this.loadingDemo || this.logAnalysis.lines.length) {
      return;
    }

    this.noFiles = false;
    this.loadingDemo = true;
    this.seedDemoColors();

    setTimeout(() => {
      const file = createLargeLogFile();
      const loaded = firstValueFrom(this.logAnalysis.changed.pipe(take(1)));
      this.logAnalysis.addFiles([file]);
      loaded.then(() => {
        this.loadingDemo = false;
      });
    });
  }

  public dropped(event: FileDropEvent) {
    this.noFiles = false;
    let infos = [];
    for (const file of event.files) {
      file.fileEntry.file((info) => {
        infos.push(info);
        if (infos.length == event.files.length) {
          this.logAnalysis.addFiles(infos);
        }
      });
    }
  }

  public keyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.code) {
        case "KeyH":
          this.colorFilter.hideUnfiltered = !this.colorFilter.hideUnfiltered;
          break;
        case "KeyN":
          const text = window.getSelection().toString();
          if (text) {
            this.colorFilter.addColorItem(
              text,
              true,
              ColorSelectorComponent.createRainbowColor(),
            );
          }
      }
    }
  }

  private seedDemoColors() {
    if (!this.colorFilter.items.some((item) => item.text === "ERROR")) {
      this.colorFilter.addColorItem("ERROR", true, "#ff0000");
    }
    if (!this.colorFilter.items.some((item) => item.text === "WARN")) {
      this.colorFilter.addColorItem("WARN", true, "#ffa500");
    }
  }
}
