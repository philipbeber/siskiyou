import { Log } from "./log";
import { LogLine } from "./log-line";

import { Observable, Subject } from "rxjs";

export class LogMerger {
  public merge(logs: Log[]): LogLine[] {
    const lines: LogLine[] = [];
    let indices = new Array<number>(logs.length);
    for (var i = 0; i < logs.length; ++i) {
      indices[i] = 0;
    }
    while (true) {
      var nextLog = -1;
      for (var i = 0; i < logs.length; ++i) {
        var index = indices[i];
        if (
          index < logs[i].lines.length &&
          (nextLog == -1 ||
            logs[i].lines[index].timestamp <
              logs[nextLog].lines[indices[nextLog]].timestamp)
        ) {
          nextLog = i;
        }
      }

      if (nextLog == -1) {
        break;
      }

      // Remove dupes
      var nextLine = logs[nextLog].lines[indices[nextLog]];
      var prevLine = lines.length == 0 ? null : lines[lines.length - 1];
      if (prevLine == null || prevLine.text != nextLine.text) {
        lines.push(nextLine);
      }

      ++indices[nextLog];
    }
    return lines;
  }
}
