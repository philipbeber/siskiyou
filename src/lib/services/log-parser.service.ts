import { LogLine, InputFile, Log } from "../model";

export class LogParserService {
  public async parseFile(file: InputFile) {
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
