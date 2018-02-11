import { Injectable } from "@angular/core";
import { Log } from "./log";
import { LogLine } from "./log-line";
import { FileLoader } from "./file-loader";
import { LogMerger } from "./log-merger";

@Injectable()
export class LogAnalysisService {
  constructor() {}

  private logs: Log[] = [];
  private lines: LogLine[] = [];

  public addFiles(files: File[]) {
    new FileLoader().addFiles(files).then((logs: Log[]) => {
      this.logs = this.logs.concat(logs);
      this.lines = new LogMerger().merge(this.logs);
    });
  }
}
