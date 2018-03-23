import { Injectable, NgZone } from "@angular/core";
import {
  Log,
  LogLine,
  SelectableDataSet,
  SelectableItem,
  Filter,
  LogLineView
} from "../model";
import { Subject, Observable, Subscription } from "rxjs";
import { FileLoaderService } from "./file-loader.service";
import { LogMergerService } from "./log-merger.service";
import { LogParserService } from "./log-parser.service";

@Injectable()
export class LogAnalysisService {
  constructor(
    private ngZone: NgZone,
    private fileLoader: FileLoaderService,
    private logMerger: LogMergerService,
    private logParser: LogParserService
  ) {
    this.changedSubject = new Subject();
    this.changed = this.changedSubject.asObservable();
  }

  private filters: Filter[] = [];

  public logs: Log[] = [];
  public lines: LogLine[] = [];
  public busy: boolean;
  public changed: Observable<void>;
  private changedSubject: Subject<void>;

  public addFiles(files: File[]) {
    this.busy = true;
    console.log("adding files");
    this.ngZone.runOutsideAngular(() => {
      const newLogs: Log[] = [];
      this.fileLoader
        .loadFiles(files)
        .flatMap(file => this.logParser.parseFile(file))
        .subscribe({
          next: log => {
            if (log) {
              newLogs.push(log);
            }
          },
          complete: () => {
            this.ngZone.run(() => {
              this.processNewLogs(newLogs);
              this.logs = this.logs.concat(newLogs);
              this.lines = this.logMerger.merge(this.logs);
              this.busy = false;
              console.log("done adding files");
              this.changedSubject.next();
            });
          }
        });
    });
  }

  public addFilter(filter: Filter) {
    this.filters.push(filter);
    filter.changed.subscribe(() => {
      this.changedSubject.next();
    });
  }

  public getFilters(): ReadonlyArray<Filter> {
    return this.filters;
  }

  public getFilteredLines(): Array<LogLineView> {
    const lines: Array<LogLineView> = [];
    for (let line of this.lines) {
      let view = new LogLineView(line.text, true);
      for (let filter of this.filters) {
        filter.updateView(view, line);
        if (!view.visible) {
          break;
        }
      }

      if (view.visible) {
        lines.push(view);
      }
    }
    return lines;
  }

  private processNewLogs(logs: Log[]) {}
}
