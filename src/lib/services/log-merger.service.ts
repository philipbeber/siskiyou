import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";

import { Log, LogLine } from "../model";

@Injectable()
export class LogMergerService {
  public merge(logs: Log[]): LogLine[] {
    const lines: LogLine[] = [];
    for (let log of logs) {
      for (let line of log.lines) {
        lines.push(line);
      }
    }
    return lines;
  }
}
