import { Component } from "@angular/core";
import { DroppedFile, FileDropEvent } from "../file-drop";
import { LogAnalysisService } from "../log-analysis.service";

@Component({
  selector: "demo-root",
  templateUrl: "./dropdemo.component.html",
  styleUrls: ["./dropdemo.component.css"]
})
export class DropdemoComponent {
  public files: DroppedFile[] = [];
  public fileNames: string[] = [];

  constructor(public logAnalysis: LogAnalysisService) {}

  public dropped(event: FileDropEvent) {
    this.files = event.files;
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

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
