import { Component, ViewChild, ElementRef } from "@angular/core";
import { LogAnalysisService } from "../../lib/services/log-analysis.service";
import { Filter, LogLineColorView } from "../../lib/model";
import * as moment from "moment";
import { CustomFileLoaderService } from "./custom-file-loader";
import { FileLoaderService } from "../../lib/services/file-loader.service";
import { FileDropEvent } from "../../lib/components/file-drop";
import { SettingsStorageService } from "../../lib/services/settings-storage.service";

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
  noFiles = true;
  noLines = false;
  @ViewChild("filteredDisplay") filteredDisplay: ElementRef;

  constructor(
    private logAnalysis: LogAnalysisService,
    settings: SettingsStorageService
  ) {
    this.colorFilter = settings.createFilter("Color");
    logAnalysis.addFilter(this.colorFilter);
    this.logAnalysis.changed.debounceTime(400).subscribe(() => {
      this.updateView();
    });
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

  private updateView() {
    if (this.noFiles) {
      return;
    }
    let m = moment();
    console.log("Starting GFL");
    const el = this.filteredDisplay.nativeElement;
    while (el.hasChildNodes()) {
      el.removeChild(el.firstChild);
    }
    let frag = document.createDocumentFragment();
    let lines: string[] = [];
    let currentColor: string = null;
    const lineObjs = this.logAnalysis.getFilteredLines();
    console.log("Got " + lineObjs.length + " lines");
    this.noLines = !lineObjs.length;
    for (let line of lineObjs) {
      const coloredLine = line as LogLineColorView;
      if (coloredLine.color != currentColor) {
        this.flush(frag, lines, currentColor);
        lines = [];
        currentColor = coloredLine.color;
      }
      lines.push(line.text);
    }
    this.flush(frag, lines, currentColor);
    el.appendChild(frag);
    console.log("GFL end: " + moment().diff(m, "seconds", true));
  }

  private flush(frag: DocumentFragment, lines: string[], color: string) {
    if (!lines || !lines.length) {
      return;
    }

    const allText = lines.join("\n");
    let e = document.createElement("pre");
    e.textContent = allText;
    if (color) {
      e.style.backgroundColor = color;
    }
    frag.appendChild(e);
  }
}
