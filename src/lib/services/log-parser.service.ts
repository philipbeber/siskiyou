import { LogLine, InputFile, Log } from "../model";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";

export class LogParserService {
  public parseFile(file: InputFile): Observable<Log> {
    const subject = new ReplaySubject<Log>();
    this.parseFilePromise(file).then(log => {
      if (log) {
        subject.next(log);        
      }
      subject.complete();
    });
    return subject.asObservable();
  }

  private async parseFilePromise(file: InputFile) {
    let item : IteratorResult<string>;
    const reader = await file.getLines();
    const log = new Log(file.path);
    let index = 0;
    while (!(item = reader.next()).done) {
      const line = new LogLine(index++);
      line.text = item.value;
      log.lines.push(line);
    }
    return log;
  }
}
